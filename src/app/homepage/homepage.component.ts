import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from '../encryption.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css', '../app.component.css']
})
export class HomepageComponent {

  constructor(
    private router: Router,
    private encryptionService: EncryptionService
  ) {}

  textTapped: string = "" ;
  encryptedDataTextAES: string = "";
  encryptedDataTextRC4: string = "";
  encryptedDataTextDES: string = "";
  decryptedDataTextAES: string = "";
  decryptedDataTextRC4: string = "";
  decryptedDataTextDES: string = "";
  
  encryptedDataImageAES: string = "";
  encryptedDataImageRC4: string = "";
  encryptedDataImageDES: string = "";
  decryptedDataURLImage: string = "";

  encryptedDataDocumentAES: string = "";
  encryptedDataDocumentRC4: string = "";
  encryptedDataDocumentDES: string = "";
  decryptedDataURLDocument: string = "";

  encryptedDataVideoAES: string = "" ;
  encryptedDataVideoRC4: string = "" ;
  encryptedDataVideoDES: string = "" ;
  decryptedDataURLVideo: string = "" ;

  signOut() {
    this.router.navigate(['login-page']);
  }

  // Encrypt selected text
  onSelectedDataText() {
    if (this.textTapped != "") {
      this.decryptedDataTextAES = "" ;
      this.decryptedDataTextRC4 = "" ;
      this.decryptedDataTextDES = "" ;
      [this.encryptedDataTextAES, this.encryptedDataTextRC4, this.encryptedDataTextDES] = this.encryptionService.encrypt(this.textTapped);
      this.textTapped = "" ;
    }
  }

  // Decrypt image
  decryptDataText() {
    [this.decryptedDataTextAES, this.decryptedDataTextRC4, this.decryptedDataTextDES] = this.encryptionService.decrypt(this.encryptedDataTextAES, this.encryptedDataTextRC4, this.encryptedDataTextDES);
    this.encryptedDataTextAES = "" ;
    this.encryptedDataTextRC4 = "" ;
    this.encryptedDataTextDES = "" ;
  }

  // Encrypt selected image
  onSelectedDataImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.encryptionService.encryptFile(file).then((data: any) => {
        [this.encryptedDataImageAES, this.encryptedDataImageRC4, this.encryptedDataImageDES] = data;
        console.log('Encrypted image data AES:', this.encryptedDataImageAES);
        console.log('Encrypted image data RC4:', this.encryptedDataImageRC4);
        console.log('Encrypted image data DES:', this.encryptedDataImageDES);
      }).catch((error: any) => {
        console.error('Encryption error:', error);
      });
    }
  }

  // Decrypt image
  decryptDataImage() {
    if (this.encryptedDataImageAES) {
      this.encryptionService.decryptFile(this.encryptedDataImageAES, "AES").then((decryptedBuffer: string) => {
        // To decrypt video
        const blob = new Blob([decryptedBuffer], { type: 'image/png' });
        // Generate an URL from the data
        this.decryptedDataURLImage = URL.createObjectURL(blob); 
        console.log('Data decrypted :', this.encryptedDataImageAES);
      }).catch((error: any) => {
        console.error('Decryption error:', error);
      });
    }
  }

  // Encrypt selected document (XML, PDF, XLS)
  onSelectedDataDocument(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.encryptionService.encryptFile(file).then((data: any) => {
        [this.encryptedDataDocumentAES, this.encryptedDataDocumentRC4, this.encryptedDataDocumentDES] = data;
        console.log('Encrypted document data:', this.encryptedDataDocumentAES);
        console.log('Encrypted document data:', this.encryptedDataDocumentRC4);
        console.log('Encrypted document data:', this.encryptedDataDocumentDES);
      }).catch((error: any) => {
        console.error('Encryption error:', error);
      });
    }
  }

  // Decrypt document
  decryptDataDocument() {
    if (this.encryptedDataDocumentAES) {
      this.encryptionService.decryptFile(this.encryptedDataDocumentAES, "AES").then((decryptedBuffer: string) => {
        // To decrypt video
        const blob = new Blob([decryptedBuffer], { type: 'application/octet-stream' });
        // Generate an URL from the data
        this.decryptedDataURLDocument = URL.createObjectURL(blob); 
        console.log('Data decrypted :', this.encryptedDataDocumentAES);
      }).catch((error: any) => {
        console.error('Decryption error:', error);
      });
    }
  }

  // Encrypt a video
  onSelectedDataVideo(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.encryptionService.encryptFile(file).then((data: any) => {
        [this.encryptedDataVideoAES, this.encryptedDataVideoRC4, this.encryptedDataVideoDES] = data;
        console.log('Encrypted data :', this.encryptedDataVideoAES);
        console.log('Encrypted data :', this.encryptedDataVideoRC4);
        console.log('Encrypted data :', this.encryptedDataVideoDES);
      }).catch((error: any) => {
        console.error('Encryption error :', error);
      });
    }
  }

  // Decrypt a video
  decryptDataVideo() {
    if (this.encryptedDataVideoAES) {
      this.encryptionService.decryptFile(this.encryptedDataVideoAES, "AES").then((decryptedBuffer: string) => {
        // To decrypt video
        const blob = new Blob([decryptedBuffer], { type: 'video/mp4' });
        // Generate an URL from the data
        this.decryptedDataURLVideo = URL.createObjectURL(blob); 
        console.log('Data decrypted :', this.encryptedDataVideoAES);
      }).catch((error: any) => {
        console.error('Decryption error:', error);
      });
    }
  }

}

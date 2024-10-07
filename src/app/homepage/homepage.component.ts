import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from '../encryption.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackConnectionService } from '../back-connection.service';
import * as CryptoJS from 'crypto-js';

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
    private encryptionService: EncryptionService,
    private back: BackConnectionService
  ) {}

  textName: string = "" ;
  textTapped: string = "" ;
  encryptedDataTextAES: string = "";
  encryptedDataTextRC4: string = "";
  encryptedDataTextDES: string = "";
  decryptedDataTextAES: string = "";
  decryptedDataTextRC4: string = "";
  decryptedDataTextDES: string = "";

  encryptedVideo: string = ''; // Contenu crypté de la vidéo
  downloadLink: string | null = null; // URL de téléchargement pour la vidéo décryptée

  encryptedFile: string = ''; // Contenu crypté du fichier texte ou PDF
  fileDownloadLink: string | null = null; // URL de téléchargement pour le fichier décrypté
  fileName: string = ''; // Nom du fichier décrypté

  signOut() {
    this.router.navigate(['login-page']);
  }

  navigateToVisualiseData() {
    this.router.navigate(['visualiseData']);
  }

  addText(){
    this.back.saveText('123456789', 'test', 'tetetete', 'tatatata', 'totototo').subscribe(reponse => {
      console.log('reponse : ' + reponse.message)
    }) ;
  }

  // Encrypt selected text
  onSelectedDataText() {
    if (this.textName != "" && this.textTapped != "") {
      this.encryptionService.encryptText(this.textName, this.textTapped).then((response) => {
        console.log(response) ;
      });
      this.textName = "" ;
      this.textTapped = "" ;
    }
  }

  // Decrypt text
  decryptDataText() {
    if (this.encryptedDataTextAES != "" && this.encryptedDataTextRC4 != "" && this.encryptedDataTextDES != "") {
      this.encryptionService.decryptText(this.encryptedDataTextAES, this.encryptedDataTextRC4, this.encryptedDataTextDES).then((response) => {
        this.decryptedDataTextAES = response[0] ;
        this.decryptedDataTextRC4 = response[1] ;
        this.decryptedDataTextDES = response[2] ;
      }) ;
      this.encryptedDataTextAES = "" ;
      this.encryptedDataTextRC4 = "" ;
      this.encryptedDataTextDES = "" ;
    }
  }

  // Encrypt an element imported
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileType = file.type.split('/')[0];
      // Call different method depending of the type of the document
      if (fileType === 'video') {
        this.encryptionService.encryptVideo(file.name, file).then((response) => {
          console.log(response)
          // this.encryptedVideo = encryptedV ;
        });
      } else if (fileType === 'application' || fileType === 'text') {
        this.encryptionService.encryptFile(file.name, file).then((response) => {
          console.log('Response : ' + response)
          // this.fileName = fileName ;
          // this.encryptedFile = encryptedF ;
          this.testDecrypt(response) ;
        });
      } else if (fileType === 'image') {
        this.encryptionService.encryptImage(file.name, file).then((response) => {
          console.log('Image encrypted successfully:', response);
        }).catch((error) => {
          console.error('Encryption error:', error);
        });
      }
    }
  }

  testDecrypt(AES: string): void {
    // this.encryptionService.decryptFile(AES, AES, AES, "coonvention_compressee.pdf").then((response) => {
    //   console.log('Decrypted file : ' + response[0])
    // }) ;
  }

  // Decrypt a video
  decryptVideo() {
    if (!this.encryptedVideo) return;

    // this.encryptionService.decryptVideo(this.encryptedVideo).then((link) => {
    //   this.downloadLink = link ;
    // })
  }

  // Decrypt a file
  decryptFile() {
    if (!this.encryptedFile) return;
  
    // this.encryptionService.decryptFile(this.encryptedFile, this.fileName).then((link) => {
    //   this.fileDownloadLink = link ;
    // })
  }

}

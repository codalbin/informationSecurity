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

  encryptedData: string = "" ;
  decryptedDataURL: string = "" ;

  signOut() {
    this.router.navigate(['login-page']);
  }

  // Encrypt a data
  onSelectedData(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.encryptionService.encryptFile(file).then((data: any) => {
        this.encryptedData = data;
        console.log('Encrypted data :', this.encryptedData);
      }).catch((error: any) => {
        console.error('Encryption error :', error);
      });
    }
  }

  // Decrypt a data
  decryptData() {
    if (this.encryptedData) {
      const decryptedBuffer = this.encryptionService.decryptFile(this.encryptedData);

      // To decrypt video
      const blob = new Blob([decryptedBuffer], { type: 'video/mp4' });
      // Generate an URL from the data
      this.decryptedDataURL = URL.createObjectURL(blob); 
      console.log('Data decrypted :', this.encryptedData);
    }
  }

}

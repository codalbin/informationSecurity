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

  textName: string = "" ;
  textTapped: string = "" ;
  errorMessageText: string = "" ;

  encryptedDataTextAES: string = "";
  encryptedDataTextRC4: string = "";
  encryptedDataTextDES: string = "";

  signOut() {
    this.router.navigate(['login-page']);
  }

  navigateToVisualiseData() {
    this.router.navigate(['visualiseData']);
  }

  // Encrypt selected text
  onSelectedDataText() {
    if (this.textName != "" && this.textTapped != "") {
      this.encryptionService.encryptText(this.textName, this.textTapped).then((response) => {
        console.log(response) ;
      });
      this.textName = "" ;
      this.textTapped = "" ;
    } else {
      this.errorMessageText = "Complete the title or the text" ;
      setTimeout(() => {
        this.errorMessageText = '';
      }, 3000);
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
          // this.encryptedFile = encryptedF ;
        });
      } else if (fileType === 'image') {
        this.encryptionService.encryptImage(file.name, file).then((response) => {
          console.log('Image encrypted successfully:', response);
        })
      }
    }
  }

}

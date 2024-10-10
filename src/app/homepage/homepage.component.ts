import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from '../encryption.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackConnectionService } from '../back-connection.service';

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
  errorMessageText: string = "" ;
  errorMessageFile: string = "" ;

  waitingMessage: string = "" ;

  encryptedDataTextAES: string = "";
  encryptedDataTextRC4: string = "";
  encryptedDataTextDES: string = "";

  signOut() {
    this.router.navigate(['login-page']);
  }

  navigateToVisualiseData() {
    this.router.navigate(['visualiseData']);
  }

  // Get the token to identify the user connected
  getToken(): string {
    return localStorage.getItem('token') || "" ;
  }

  // Encrypt selected text
  onSelectedDataText() {
    this.back.getAllTexts(this.getToken()).subscribe(response => {
      // Check if the title of the text is already used
      if(response.textNames.includes(this.textName)) {
        this.errorMessageText = "Title already used" ;
        setTimeout(() => {
          this.errorMessageText = '';
        }, 3000);
      } else if (this.textName != "" && this.textTapped != "") {
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
    }) ;
  }

  // Encrypt an element imported
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileType = file.type.split('/')[0];

      this.back.getAllFiles(this.getToken()).subscribe(response => {
        // Check if the title of the text is already used
        if(response.fileNames.includes(file.name)) {
          this.errorMessageFile = "File already downloaded or name already used" ;
          setTimeout(() => {
            this.errorMessageFile = '';
          }, 3000);
        } else {
          this.waitingMessage = "Your document is being encrypted and stored..."
          this.encryptionService.encryptDocument(file.name, file).then((response) => {
            console.log(response);
            this.waitingMessage = "Document encrypted and stored !" ;
          });
        }
      }) ;
    }
  }

}

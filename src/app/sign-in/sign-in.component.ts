import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from '../encryption.service';
import { BackConnectionService } from '../back-connection.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css', '../app.component.css']
})
export class SignInComponent {

  passwordUser: string = "";
  passwordUserConfirmation: string = "" ;
  loginUser: string = "";
  errorMessage: string = "" ;

  constructor(
    private router: Router,
    private encryption: EncryptionService,
    private back: BackConnectionService
  ) {}

  signIn() {
    if (this.loginUser == "") {
      this.errorMessage = "Write a username" ;
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    } else if (this.passwordUser != this.passwordUserConfirmation || this.passwordUser == "") {
      this.errorMessage = "Your password and confirmation password are differents" ;
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    } else {
      const hashedPassword = this.encryption.hashPassword(this.passwordUser) ;
      this.back.signIn(this.loginUser, hashedPassword).subscribe({
          next: () => {
              this.navigateToLogin();
          },
          error: (error) => {
            if (error.status === 0 || error.status === 500) {
              console.error('Sign In failed', error);
              // Display error message during 3 secondes then delete it
              this.errorMessage = "Error server" ;
              setTimeout(() => {
                this.errorMessage = '';
              }, 3000);
            } else {
              console.error('Sign In failed', error);
              this.passwordUser = "";
              this.passwordUserConfirmation = "";
              this.errorMessage = "Username already used" ;
              setTimeout(() => {
                this.errorMessage = '';
              }, 3000);
            }
          }
      });
    }
  }

  navigateToLogin() {
    this.router.navigate(['login-page']);
  }

}

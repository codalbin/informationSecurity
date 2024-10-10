import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackConnectionService } from '../back-connection.service';
import { EncryptionService } from '../encryption.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css', '../app.component.css']
})
export class LoginPageComponent implements OnInit {

  passwordUser: string = "";
  loginUser: string = "";
  errorMessage: string = "" ;

  constructor(
    private router: Router,
    private back: BackConnectionService,
    private encryption: EncryptionService
  ) {}

  ngOnInit(): void {
    // localStorage.removeItem('token') ;
    localStorage.clear() ;

    this.encryption.ngOnInit() ;
  }

  login() {
    const hashedPassword = this.encryption.hashPassword(this.passwordUser) ;
    this.back.login(this.loginUser, hashedPassword).subscribe({
        next: (body) => {
            this.navigateToHomepage();
            // Store the token in localStorage 
            localStorage.setItem('token', body.token)
        },
        error: (error) => {
          if (error.status === 0 || error.status === 500) {
            console.error('Login failed', error);
            // Display error message during 3 secondes then delete it
            this.errorMessage = "Error server" ;
            setTimeout(() => {
              this.errorMessage = '';
            }, 3000);
          } else {
            console.error('Login failed', error);
            this.passwordUser = "";
            this.errorMessage = "Username or password incorrect" ;
            setTimeout(() => {
              this.errorMessage = '';
            }, 3000);
          }
        }
    });
  }

  navigateToSignIn() {
    this.router.navigate(['signIn']);
  }
  
  navigateToHomepage() {
    this.router.navigate(['homepage']);
  }

}

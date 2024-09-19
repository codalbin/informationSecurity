import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css', '../app.component.css']
})
export class LoginPageComponent {

  passwordUser: string = "";
  loginUser: string = "";

  constructor(
    private router: Router
  ) {}

  login() {
    this.router.navigate(['homepage']);
  }

}

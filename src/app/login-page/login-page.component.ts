import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatabaseService, User } from '../database.service';
import { first, map } from 'rxjs/operators';


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
    private router: Router,
    private dbService: DatabaseService,
  ) {}

  login() {
    console.log(this.loginUser,this.passwordUser)
    this.dbService.addUser(this.loginUser, this.passwordUser)
    console.log('User added to the database');
    this.dbService.getUser(this.loginUser).pipe(first(),
    map(result => result as User)
  ).subscribe(result => {
    console.log('User retrieved from the database');
    console.log(result.username);
    console.log(result.password);
});
    this.router.navigate(['homepage']);
  }

}

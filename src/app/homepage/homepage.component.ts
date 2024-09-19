import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css', '../app.component.css']
})
export class HomepageComponent {

  constructor(
    private router: Router
  ) {}

  signOut() {
    this.router.navigate(['login-page']);
  }

}

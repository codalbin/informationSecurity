import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { EncryptionService } from './encryption.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    LoginPageComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'informationSecurity';

  constructor(
    private encryption: EncryptionService
  ) {}

  ngOnInit(): void {
    this.encryption.getKeys() ;
  }
}

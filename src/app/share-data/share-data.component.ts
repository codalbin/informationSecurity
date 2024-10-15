import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from '../encryption.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackConnectionService } from '../back-connection.service';

@Component({
  selector: 'app-share-data',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './share-data.component.html',
  styleUrls: ['./share-data.component.css', '../app.component.css']
})
export class ShareDataComponent {

  constructor(
    private router: Router,
    private encryptionService: EncryptionService,
    private back: BackConnectionService
  ) {}

  friendUsername: string = '' ;
  errorMessage: string = '' ;

  navigateToHomepage() {
    this.router.navigate(['homepage']);
  }

  askAccessToUser() {
    if (this.friendUsername == '') {
      this.errorMessage = "Enter a username" ;
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    } else {

    }
  }

  // TODO => dans le back créer une méthode où je peux donner un username en paramètre 
  // Créer une socket pour envoyer des notifs à l'utilisateur
}

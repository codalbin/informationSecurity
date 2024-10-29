import { Component, OnInit } from '@angular/core';
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
export class ShareDataComponent implements OnInit {

  constructor(
    private router: Router,
    private encryptionService: EncryptionService,
    private back: BackConnectionService
  ) {}

  currentUser: string = '' ;

  friendUsername: string = '' ;
  okMessage: string = '' ;
  errorMessage: string = '' ;
  allNotifications = {
    sent: [] as string[],
    received: [] as string[]
  };
  keyToSend: string = "" ;

  ngOnInit(): void {
    this.back.getNotifications(this.getToken()).subscribe(
      data => {
        this.allNotifications = data ;
      },
      error => {
        console.error('Error fetching notifications:', error);
      }
    );

    // Get the user name 
    var user = localStorage.getItem('user')
    this.currentUser = user ? user : "noUser" ;
  }

  // Get the token to identify the user connected
  getToken(): string {
    return localStorage.getItem('token') || "" ;
  }

  navigateToShareData() {
    this.router.navigate(['shareData']);
  }

  navigateToLogin() {
    this.router.navigate(['login-page']);
  }

  navigateToHomepage() {
    this.router.navigate(['homepage']);
  }

  navigateToVisualiseData() {
    this.router.navigate(['visualiseData']);
  }

  navigateToVisualizeSharedData() {
    this.router.navigate(['visualizeSharedData']);
  }

  askAccessToUser() {
    if (this.friendUsername == '') {
      this.errorMessage = "Enter a username" ;
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    } else {
      console.log(this.friendUsername)
      this.back.addNotification(this.friendUsername, this.getToken()).subscribe(
        response => {
          this.okMessage = "Your demand has been sent to " + this.friendUsername ;
          setTimeout(() => {
            this.okMessage = '' ;
          }, 3000);
          this.friendUsername = "" ;
        },
        error => {
          if (error.status === 400) {
            this.errorMessage = "You have already made a request to this user";
          } else if (error.status === 404) {
            this.errorMessage = "The username does not exist";
          } else {
            this.errorMessage = "Error server";
          }
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
          this.friendUsername = "" ;
        }
      );
    }
  }

  acceptNotification(username: string): void {
    this.back.acceptSharing(username, this.getToken()).subscribe(response => {
      if (response.key) {
        this.keyToSend = response.key ;
        this.okMessage = "Notification accepted, share this key to your friend : " + this.keyToSend ;
      } else {
        console.log(response.message)
      }
    }) ;
    this.deleteNotification(username) ;
  }

  deleteNotification(username: string): void {
    this.back.deleteNotification(username, this.getToken()).subscribe(
      response => {
        console.log('Notification deleted:', response);
        this.ngOnInit();
      },
      error => {
        console.error('Error deleting notification:', error);
      }
    );
  }
}

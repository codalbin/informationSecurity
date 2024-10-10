import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from '../encryption.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackConnectionService } from '../back-connection.service';

@Component({
  selector: 'app-all-data',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './all-data.component.html',
  styleUrls: ['./all-data.component.css', '../app.component.css']
})
export class AllDataComponent implements OnInit {

  constructor(
    private router: Router,
    private encryptionService: EncryptionService,
    private back: BackConnectionService
  ) {}

  allTexts: any ;
  allFiles: any ;
  textSelected: string = "" ;

  waitingMessage: string = "" ;

  decryptedDataTextAES: string = "";
  decryptedDataTextRC4: string = "";
  decryptedDataTextDES: string = "";

  decryptedDataFileAES: string = "";
  decryptedDataFileRC4: string = "";
  decryptedDataFileDES: string = "";

  fileName: string = "" ;

  ngOnInit(): void {
    this.getAllTexts() ;
    this.getAllFiles();
  }

  navigateToHomepage() {
    this.router.navigate(['homepage']);
  }

  navigateToLogin() {
    this.router.navigate(['login-page']);
  }

  // Get the token to identify the user connected
  getToken(): string {
    return localStorage.getItem('token') || "" ;
  }

  getAllTexts() {
    this.back.getAllTexts(this.getToken()).subscribe(response => {
      console.log(this.getToken())
      if (response.textNames) {
        this.allTexts = response.textNames ;
        console.log('all texts : ' + response.textNames.length)
      } else {
        console.log(response.message)
      }
    }) ;
  }

  getAllFiles() {
    this.back.getAllFiles(this.getToken()).subscribe(response => {
      if (response.fileNames) {
        this.allFiles = response.fileNames ;
        console.log('all files : ' + this.allFiles)
      } else {
        console.log(response.message)
      }
    }) ;
  }

  onTextClick(name: string): void {
    this.waitingMessage = "Your text is being decrypted..." ;
    this.decryptedDataTextAES = "" ;
    this.decryptedDataTextRC4 = "" ;
    this.decryptedDataTextDES = "" ;
    this.decryptedDataFileAES = "" ;
    this.decryptedDataFileRC4 = "" ;
    this.decryptedDataFileDES = "" ;
    console.log('Text name:', name);
    this.textSelected = name ;
    this.back.getOneText(this.getToken(), name).subscribe(response => {
      console.log('text from DB : ' + response.text_data_AES)
      if (response.text_data_AES) {
        this.encryptionService.decryptText(response.text_data_AES, response.text_data_RC4, response.text_data_DES).then((response) => {
          this.decryptedDataTextAES = response[0] ;
          this.decryptedDataTextRC4 = response[1] ;
          this.decryptedDataTextDES = response[2] ;
          this.waitingMessage = "" ;
        }) ;
      } else {
        console.log(response.message)
      }
    }) ;
  }

  onFileClick(name: string): void {
    this.waitingMessage = "Your document is being decrypted..." ;
    this.decryptedDataTextAES = "" ;
    this.decryptedDataTextRC4 = "" ;
    this.decryptedDataTextDES = "" ;
    this.decryptedDataFileAES = "" ;
    this.decryptedDataFileRC4 = "" ;
    this.decryptedDataFileDES = "" ;
    console.log('File name :', name);
    this.back.getOneFile(this.getToken(), name).subscribe(response => {
      // console.log(response.file_data_AES, response.file_data_RC4, response.file_data_DES);
      console.log(response.file_data_AES) ;

      const aesData: string = response.file_data_AES ;
      const rc4Data: string = response.file_data_RC4 ;
      const desData: string = response.file_data_DES ;
      if (response.file_data_AES) {
        this.fileName = name ;
        if (name.endsWith('.mp4')) {
          this.encryptionService.decryptFile(aesData,  rc4Data,  desData, name, 'video').then((response) => {
            this.decryptedDataFileAES = response[0] ;
            this.decryptedDataFileRC4 = response[1] ;
            this.decryptedDataFileDES = response[2] ;
            this.waitingMessage = "" ;
          }) ;
        } else if (name.endsWith('.pdf')){
          console.log('decryption start')
          console.log(aesData)
          this.encryptionService.decryptFile(aesData, rc4Data, desData, name, 'pdf').then((response) => {
            this.decryptedDataFileAES = response[0] ;
            this.decryptedDataFileRC4 = response[1] ;
            this.decryptedDataFileDES = response[2] ;
            this.waitingMessage = "" ;
          }) ;
        } else if (name.endsWith('.txt')){
          console.log('decryption start')
          console.log(aesData)
          this.encryptionService.decryptFile(aesData, rc4Data, desData, name, 'text').then((response) => {
            this.decryptedDataFileAES = response[0] ;
            this.decryptedDataFileRC4 = response[1] ;
            this.decryptedDataFileDES = response[2] ;
            this.waitingMessage = "" ;
          }) ;
        } else if (name.endsWith('.jpeg')){
          console.log('decryption start')
          console.log(aesData)
          this.encryptionService.decryptFile(aesData, rc4Data, desData, name, 'jpeg').then((response) => {
            this.decryptedDataFileAES = response[0] ;
            this.decryptedDataFileRC4 = response[1] ;
            this.decryptedDataFileDES = response[2] ;
            this.waitingMessage = "" ;
          }) ;
        } else if (name.endsWith('.jpg')){
          console.log('decryption start')
          console.log(aesData)
          this.encryptionService.decryptFile(aesData, rc4Data, desData, name, 'jpg').then((response) => {
            this.decryptedDataFileAES = response[0] ;
            this.decryptedDataFileRC4 = response[1] ;
            this.decryptedDataFileDES = response[2] ;
            this.waitingMessage = "" ;
          }) ;
        } else if (name.endsWith('.png')){
          console.log('decryption start')
          console.log(aesData)
          this.encryptionService.decryptFile(aesData, rc4Data, desData, name, 'png').then((response) => {
            this.decryptedDataFileAES = response[0] ;
            this.decryptedDataFileRC4 = response[1] ;
            this.decryptedDataFileDES = response[2] ;
            this.waitingMessage = "" ;
          }) ;
        } 
      } else {
        console.log(response.message)
      }
    }) ;
  }

}

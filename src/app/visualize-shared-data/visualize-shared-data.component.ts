import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from '../encryption.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackConnectionService } from '../back-connection.service';

@Component({
  selector: 'app-visualize-shared-data',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './visualize-shared-data.component.html',
  styleUrls: ['./visualize-shared-data.component.css', '../app.component.css']
})
export class VisualizeSharedDataComponent implements OnInit {

  constructor(
    private router: Router,
    private encryptionService: EncryptionService,
    private back: BackConnectionService
  ) {}

  allTexts: any ;
  allFiles: any ;
  textSelected: string = "" ;

  waitingMessage: string = "" ;

  decryptedDataFileAES: string = "";
  decryptedDataFileRC4: string = "";
  decryptedDataFileDES: string = "";

  showInputKey: boolean = false ;
  keyToDecrypt: string = "" ;
  fileToDecrypt: string = "" ;

  fileName: string = "" ;

  ngOnInit(): void {
    this.getAllFiles();
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

  // Get the token to identify the user connected
  getToken(): string {
    return localStorage.getItem('token') || "" ;
  }

  getAllFiles() {
    this.back.getSharedFiles(this.getToken()).subscribe(response => {
      if (response.fileNames) {
        this.allFiles = response.fileNames ;
        console.log('all files : ' + this.allFiles)
      } else {
        console.log(response.message)
      }
    }) ;
  }

  onFileClick(name: string) {
    this.fileToDecrypt = name ; 
    this.showInputKey = true ;
  }

  onKeyInputOk(): void {
    this.waitingMessage = "Your document is being decrypted..." ;
    this.decryptedDataFileAES = "" ;
    this.decryptedDataFileRC4 = "" ;
    this.decryptedDataFileDES = "" ;
    // console.log('File name :', name);
    this.back.getSharedFile(this.fileToDecrypt, this.keyToDecrypt, this.getToken()).subscribe(response => {
      // console.log(response.file_data_AES, response.file_data_RC4, response.file_data_DES);
      console.log(response.file_data_AES) ;
      console.log('Encryption length AES : ' + response.file_data_AES.length) ;
      console.log('Encryption length RC4 : ' + response.file_data_RC4.length) ;
      console.log('Encryption length DES : ' + response.file_data_DES.length) ;

      const aesData: string = response.file_data_AES ;
      const rc4Data: string = response.file_data_RC4 ;
      const desData: string = response.file_data_DES ;
      if (response.file_data_AES) {
        this.fileName = this.fileToDecrypt ;
        if (this.fileToDecrypt.endsWith('.mp4')) {
          this.encryptionService.decryptFile(aesData,  rc4Data,  desData, this.fileToDecrypt, 'video').then((response) => {
            this.decryptedDataFileAES = response[0] ;
            this.decryptedDataFileRC4 = response[1] ;
            this.decryptedDataFileDES = response[2] ;
            this.waitingMessage = "" ;
          }) ;
        } else if (this.fileToDecrypt.endsWith('.pdf')){
          // console.log('decryption start')
          // console.log(aesData)
          this.encryptionService.decryptFile(aesData, rc4Data, desData, this.fileToDecrypt, 'pdf').then((response) => {
            this.decryptedDataFileAES = response[0] ;
            this.decryptedDataFileRC4 = response[1] ;
            this.decryptedDataFileDES = response[2] ;
            this.waitingMessage = "" ;
          }) ;
        } else if (this.fileToDecrypt.endsWith('.txt')){
          // console.log('decryption start')
          // console.log(aesData)
          this.encryptionService.decryptFile(aesData, rc4Data, desData, this.fileToDecrypt, 'text').then((response) => {
            this.decryptedDataFileAES = response[0] ;
            this.decryptedDataFileRC4 = response[1] ;
            this.decryptedDataFileDES = response[2] ;
            this.waitingMessage = "" ;
          }) ;
        } else if (this.fileToDecrypt.endsWith('.jpeg')){
          // console.log('decryption start')
          // console.log(aesData)
          this.encryptionService.decryptFile(aesData, rc4Data, desData, this.fileToDecrypt, 'jpeg').then((response) => {
            this.decryptedDataFileAES = response[0] ;
            this.decryptedDataFileRC4 = response[1] ;
            this.decryptedDataFileDES = response[2] ;
            this.waitingMessage = "" ;
          }) ;
        } else if (this.fileToDecrypt.endsWith('.jpg')){
          // console.log('decryption start')
          // console.log(aesData)
          this.encryptionService.decryptFile(aesData, rc4Data, desData, this.fileToDecrypt, 'jpg').then((response) => {
            this.decryptedDataFileAES = response[0] ;
            this.decryptedDataFileRC4 = response[1] ;
            this.decryptedDataFileDES = response[2] ;
            this.waitingMessage = "" ;
          }) ;
        } else if (this.fileToDecrypt.endsWith('.png')){
          // console.log('decryption start')
          // console.log(aesData)
          this.encryptionService.decryptFile(aesData, rc4Data, desData, this.fileToDecrypt, 'png').then((response) => {
            this.decryptedDataFileAES = response[0] ;
            this.decryptedDataFileRC4 = response[1] ;
            this.decryptedDataFileDES = response[2] ;
            this.waitingMessage = "" ;
          }) ;
        } else if (this.fileToDecrypt.endsWith('.xls')){
          // console.log('decryption start')
          // console.log(aesData)
          this.encryptionService.decryptFile(aesData, rc4Data, desData, this.fileToDecrypt, 'xls').then((response) => {
            this.decryptedDataFileAES = response[0] ;
            this.decryptedDataFileRC4 = response[1] ;
            this.decryptedDataFileDES = response[2] ;
            this.waitingMessage = "" ;
          }) ;
        } else if (this.fileToDecrypt.endsWith('.xlsx')){
          // console.log('decryption start')
          // console.log(aesData)
          this.encryptionService.decryptFile(aesData, rc4Data, desData, this.fileToDecrypt, 'xlsx').then((response) => {
            this.decryptedDataFileAES = response[0] ;
            this.decryptedDataFileRC4 = response[1] ;
            this.decryptedDataFileDES = response[2] ;
            this.waitingMessage = "" ;
          }) ;
        } 
      } else {
        console.log(response.message)
      }
      this.showInputKey = true ;
    }) ;
    this.keyToDecrypt = "" ;
  }

}

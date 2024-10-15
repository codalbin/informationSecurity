import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { BackConnectionService } from './back-connection.service';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor(
    private back: BackConnectionService
  ) { }

  key: string = 'infoSecurity24';
  secretKeyPassword: string = 'infoSec12479';
  downloadLinkAES: string | null = null;
  downloadLinkRC4: string | null = null;
  downloadLinkDES: string | null = null;

  getKeys(): void {
      // Get the key from Vault
      this.back.getEncryptionKey().subscribe({
        next: (data) => {
          this.key = data.encryptionKey;
        },
        error: (err) => {
          console.error('Error retrieving encryption key:', err);
        },
      });

      // Get the password key from Vault (salt)
      this.back.getPasswordKey().subscribe({
        next: (data) => {
          this.secretKeyPassword = data.encryptionKey;
        },
        error: (err) => {
          console.error('Error retrieving encryption key for password :', err);
        },
      });
  }

  // Hash the password of the user
  hashPassword(password: string): string {
    // Hash password
    const hashedPassword = CryptoJS.SHA256(this.secretKeyPassword + password);
    // Convert hashedPassword into string
    return hashedPassword.toString(CryptoJS.enc.Hex);
  }

  // Get the token of the connected user
  getToken(): string {
    return localStorage.getItem('token') || "" ;
  }

  // Encryption method for text
  public encryptText(textName: string, text: string): Promise<string> {
    return new Promise ((resolve, reject) => {
      const encryptedAES = CryptoJS.AES.encrypt(text, this.key).toString();
      const encryptedRC4 = CryptoJS.RC4.encrypt(text, this.key).toString();
      const encryptedDES = CryptoJS.DES.encrypt(text, this.key).toString();
      this.back.saveText(this.getToken(), textName, encryptedAES, encryptedRC4, encryptedDES).subscribe({
        next: (body) => {
          resolve(body.message) ;
        },
        error: (error) => {
          reject(error) ;
        }
      });
    }) ;
  }

  // Decryption method for text
  public decryptText(encryptedTextAES: string, encryptedTextRC4: string, encryptedTextDES: string): Promise<[string, string, string]> {
    return new Promise ((resolve) => {
      const decryptedAES = CryptoJS.AES.decrypt(encryptedTextAES, this.key).toString(CryptoJS.enc.Utf8);
      const decryptedRC4 = CryptoJS.RC4.decrypt(encryptedTextRC4, this.key).toString(CryptoJS.enc.Utf8);
      const decryptedDES = CryptoJS.DES.decrypt(encryptedTextDES, this.key).toString(CryptoJS.enc.Utf8);
      resolve([decryptedAES, decryptedRC4, decryptedDES])
    }) ;
  }

  // Encryption method for document (pdf, image, video, txt)
  encryptDocument(docTitle: string, docBlob: Blob): Promise<string> {
    return new Promise ((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(docBlob);
      fileReader.onload = () => {
        const arrayBuffer = fileReader.result as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

        console.time('AES Encryption Time');
        const encryptedAES = CryptoJS.AES.encrypt(wordArray, this.key).toString();
        console.timeEnd('AES Encryption Time');
        console.time('RC4 Encryption Time');
        const encryptedRC4 = CryptoJS.RC4.encrypt(wordArray, this.key).toString();
        console.timeEnd('RC4 Encryption Time');
        console.time('DES Encryption Time');
        const encryptedDES = CryptoJS.DES.encrypt(wordArray, this.key).toString();
        console.timeEnd('DES Encryption Time');

        this.back.saveFile(this.getToken(), docTitle, encryptedAES, encryptedRC4, encryptedDES).subscribe({
          next: (body) => {
            resolve(body.message) ;
          },
          error: (error) => {
            reject(error) ;
          }
        });
      };
    });
  }
  
  // Decrypt a file (pdf, image, video, txt)
  decryptFile(encryptedFileAES: string, encryptedFileRC4: string, encryptedFileDES: string, fileName: string, fileType: string): Promise<[string, string, string]> {
    return new Promise((resolve, reject) => {
      try {
        let mimeType = '';
        if (fileType === 'text') {
          mimeType = 'text/plain';
        } else if (fileType === 'jpeg') {
          mimeType = 'image/jpeg'; 
        } else if (fileType === 'jpg') {
          mimeType = 'image/jpg'; 
        } else if (fileType === 'png') {
          mimeType = 'image/png'; 
        } else if (fileType === 'video') {
          mimeType = 'video/mp4';
        } else if (fileType === 'pdf') {
          mimeType = 'application/pdf';
        } else if (fileType === 'xls' || fileType === 'xlsx') {
          mimeType = 'application/vnd.ms-excel';
        }
  
        console.time('AES Decryption Time');
        const decryptedBlobAES = this.decryptAlgo(encryptedFileAES, mimeType, 'AES');
        console.timeEnd('AES Decryption Time');
        console.time('RC4 Decryption Time');
        const decryptedBlobRC4 = this.decryptAlgo(encryptedFileRC4, mimeType, 'RC4');
        console.timeEnd('RC4 Decryption Time');
        console.time('DES Decryption Time');
        const decryptedBlobDES = this.decryptAlgo(encryptedFileDES, mimeType, 'DES');
        console.timeEnd('DES Decryption Time');
  
        resolve([
          URL.createObjectURL(decryptedBlobAES),
          URL.createObjectURL(decryptedBlobRC4),
          URL.createObjectURL(decryptedBlobDES)
        ]);
      } catch (error:any) {
        reject('Error during decryption: ' + error.message);
      }
    });
  }
  
  decryptAlgo(encryptedData: string, mimeType: string, algorithm: string): Blob {
    var decryptedBytes: any;
    switch (algorithm) {
      case 'AES':
        decryptedBytes = CryptoJS.AES.decrypt(encryptedData, this.key);
        break;
      case 'RC4':
        decryptedBytes = CryptoJS.RC4.decrypt(encryptedData, this.key);
        break;
      case 'DES':
        decryptedBytes = CryptoJS.DES.decrypt(encryptedData, this.key);
        break;
      default:
        break;
    }
  
    const decryptedWordArray = CryptoJS.lib.WordArray.create(decryptedBytes.words);
    const arrayBuffer = new ArrayBuffer(decryptedWordArray.sigBytes);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < decryptedWordArray.sigBytes; i++) {
      uint8Array[i] = (decryptedWordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    return new Blob([arrayBuffer], { type: mimeType });
  }
  
}

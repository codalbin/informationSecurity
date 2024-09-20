import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  key = 'infoSecurity24';

  // Encryption method for string
  public encrypt(password: string) {
    // return CryptoJS.AES.encrypt(password, this.key).toString();
    // return CryptoJS.RC4.encrypt(password, this.key).toString();
    return CryptoJS.DES.encrypt(password, this.key).toString();
  }

  // Decryption method for string
  public decrypt(encryptedPassword: string) {
    // return CryptoJS.AES.decrypt(encryptedPassword, this.key).toString(CryptoJS.enc.Utf8); // Decrypt all bytes and string them together
    // return CryptoJS.RC4.decrypt(encryptedPassword, this.key).toString(CryptoJS.enc.Utf8); // Decrypt all bytes and string them together
    return CryptoJS.DES.decrypt(encryptedPassword, this.key).toString(CryptoJS.enc.Utf8); // Decrypt all bytes and string them together
  }

  // Encryption method for files
  public encryptFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      // Read and encrypt the file when it is completely loaded
      fileReader.onload = (event: any) => {
        const fileData = event.target.result;
        const encryptedData = CryptoJS.AES.encrypt(fileData, this.key).toString();
        // const encryptedData = CryptoJS.RC4.encrypt(fileData, this.key).toString();
        // const encryptedData = CryptoJS.DES.encrypt(fileData, this.key).toString();
        resolve(encryptedData);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      // Read the file as an ArrayBuffer (load the file)
      fileReader.readAsDataURL(file);
    });
  }

  // Dencryption method for files
  public decryptFile(encryptedData: string): string {
    return CryptoJS.AES.decrypt(encryptedData, this.key).toString(CryptoJS.enc.Utf8);
    // return CryptoJS.RC4.decrypt(encryptedData, this.key).toString(CryptoJS.enc.Utf8);
    // return CryptoJS.DES.decrypt(encryptedData, this.key).toString(CryptoJS.enc.Utf8);
  }
}

import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  key = 'infoSecurity24';

  // Encryption method for string
  public encrypt(text: string): [string, string, string] {
    const encryptedAES = CryptoJS.AES.encrypt(text, this.key).toString();
    const encryptedRC4 = CryptoJS.RC4.encrypt(text, this.key).toString();
    const encryptedDES = CryptoJS.DES.encrypt(text, this.key).toString();
    return [encryptedAES, encryptedRC4, encryptedDES] ;
  }

  // Decryption method for string
  public decrypt(encryptedTextAES: string, encryptedTextRC4: string, encryptedTextDES: string): [string, string, string] {
    const decryptedAES = CryptoJS.AES.decrypt(encryptedTextAES, this.key).toString(CryptoJS.enc.Utf8);
    const decryptedRC4 = CryptoJS.RC4.decrypt(encryptedTextRC4, this.key).toString(CryptoJS.enc.Utf8);
    const decryptedDES = CryptoJS.DES.decrypt(encryptedTextDES, this.key).toString(CryptoJS.enc.Utf8);
    return [decryptedAES, decryptedRC4, decryptedDES] ;
  }

  // Encryption method for files
  public encryptFile(file: File): Promise<[string, string, string]> {
    return new Promise((resolve, reject) => {
      // Encrypt the file using AES, RC4, and DES
      Promise.all([
        this.encryptFileAES(file),
        this.encryptFileRC4(file),
        this.encryptFileDES(file)
      ])
      .then((encryptedData) => {
        resolve(encryptedData);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  public encryptFileAES(file: File): Promise<string> {
    return this.encryptFileWithAlgorithm(file, CryptoJS.AES);
  }

  public encryptFileRC4(file: File): Promise<string> {
    return this.encryptFileWithAlgorithm(file, CryptoJS.RC4);
  }

  public encryptFileDES(file: File): Promise<string> {
    return this.encryptFileWithAlgorithm(file, CryptoJS.DES);
  }

  // Helper function to encrypt a file with a given algorithm
  private encryptFileWithAlgorithm(file: File, algorithm: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event: any) => {
        const fileData = event.target.result;
        const encryptedData = algorithm.encrypt(fileData, this.key).toString();
        resolve(encryptedData);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsDataURL(file);
    });
  }

  // Decryption method for files
  public decryptFile(encryptedData: string, algorithmUsed: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Decrypt using AES, then RC4, then DES
      let decryptedData: string;
      try {
        switch (algorithmUsed) {
          case "AES" : 
            decryptedData = this.decryptFileWithAlgorithm(encryptedData, CryptoJS.AES);
            resolve(decryptedData) ;
            break ;
          case "RC4" : 
            decryptedData = this.decryptFileWithAlgorithm(encryptedData, CryptoJS.RC4);
            resolve(decryptedData) ;
            break ;
          case "DES" : 
            decryptedData = this.decryptFileWithAlgorithm(encryptedData, CryptoJS.DES);
            resolve(decryptedData) ;
            break ;
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // Helper function to decrypt a string with a given algorithm
  private decryptFileWithAlgorithm(encryptedData: string, algorithm: any): string {
    return algorithm.decrypt(encryptedData, this.key).toString(CryptoJS.enc.Utf8);
  }
}

import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { BackConnectionService } from './back-connection.service';
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor(
    private back: BackConnectionService
  ) { }

  key = 'infoSecurity24';
  secretKeyPassword = 'infoSec12479'
  downloadLinkAES: string | null = null;
  downloadLinkRC4: string | null = null;
  downloadLinkDES: string | null = null;
  fileDownloadLinkAES: string | null = null;
  fileDownloadLinkRC4: string | null = null;
  fileDownloadLinkDES: string | null = null;

  // Hash the password of the user
  hashPassword(password: string): string {
    // Hash password
    const hashedPassword = CryptoJS.SHA256(this.secretKeyPassword + password);
    // Convert hashedPassword into string
    return hashedPassword.toString(CryptoJS.enc.Hex);
  }

  // getToken(): string {
  //   return localStorage.getItem('token') || "";
  // }

  // async encryptFile(fileTitle: string, fileBlob: Blob): Promise<string> {
  //   const arrayBuffer = await fileBlob.arrayBuffer();
  //   const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  //   const encrypted = CryptoJS.AES.encrypt(wordArray, this.key).toString();
    
  //   return new Promise((resolve, reject) => {
  //     this.back.saveFile(this.getToken(), fileTitle, encrypted, encrypted, encrypted).subscribe({
  //       next: (body) => resolve(body.message),
  //       error: (error) => reject(error)
  //     });
  //   });
  // }

  // decryptFile(encryptedFileAES: string, encryptedFileRC4: string, encryptedFileDES: string, fileName: string): Promise<[string, string, string]> {
  //   return new Promise((resolve) => {
  //     const decryptAES = this.decryptAndCreateBlob(encryptedFileAES, fileName);
  //     const decryptRC4 = this.decryptAndCreateBlob(encryptedFileRC4, fileName);
  //     const decryptDES = this.decryptAndCreateBlob(encryptedFileDES, fileName);

  //     Promise.all([decryptAES, decryptRC4, decryptDES]).then(results => {
  //       resolve(results.map(blob => URL.createObjectURL(blob)) as [string, string, string]);
  //     });
  //   });
  // }

  // private decryptAndCreateBlob(encryptedData: string, fileName: string): Promise<Blob> {
  //   return new Promise((resolve) => {
  //     console.log('Encrypted data:', encryptedData);
  //     const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key);
  //     console.log('Decrypted WordArray:', decrypted);
  //     const typedArray = this.convertWordArrayToUint8Array(decrypted);
  //     console.log('TypedArray:', typedArray);
      
  //     const mimeType = this.getMimeType(fileName);
  //     console.log('MIME type:', mimeType);
  //     const blob = new Blob([typedArray], { type: mimeType });
  //     console.log('Created Blob:', blob);
  //     resolve(blob);
  //   });
  // }

  // private convertWordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray): Uint8Array {
  //   const arrayBuffer = new ArrayBuffer(wordArray.sigBytes);
  //   const uint8Array = new Uint8Array(arrayBuffer);
  //   for (let i = 0; i < wordArray.sigBytes; i++) {
  //     uint8Array[i] = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  //   }
  //   return uint8Array;
  // }

  // private getMimeType(fileName: string): string {
  //   const extension = fileName.split('.').pop()?.toLowerCase();
  //   switch (extension) {
  //     case 'txt': return 'text/plain';
  //     case 'pdf': return 'application/pdf';
  //     case 'mp4': return 'video/mp4';
  //     default: return 'application/octet-stream';
  //   }
  // }

  // encryptText(textName: string, text: string): Promise<string> {
  //   const encrypted = CryptoJS.AES.encrypt(text, this.key).toString();
  //   return new Promise((resolve, reject) => {
  //     this.back.saveText(this.getToken(), textName, encrypted, encrypted, encrypted).subscribe({
  //       next: (body) => resolve(body.message),
  //       error: (error) => reject(error)
  //     });
  //   });
  // }

  // decryptText(encryptedTextAES: string, encryptedTextRC4: string, encryptedTextDES: string): Promise<[string, string, string]> {
  //   return new Promise((resolve) => {
  //     const decryptAES = CryptoJS.AES.decrypt(encryptedTextAES, this.key).toString(CryptoJS.enc.Utf8);
  //     const decryptRC4 = CryptoJS.AES.decrypt(encryptedTextRC4, this.key).toString(CryptoJS.enc.Utf8);
  //     const decryptDES = CryptoJS.AES.decrypt(encryptedTextDES, this.key).toString(CryptoJS.enc.Utf8);
  //     resolve([decryptAES, decryptRC4, decryptDES]);
  //   });
  // }

  // Get the token to identify the user connected
  getToken(): string {
    return localStorage.getItem('token') || "" ;
  }

  // Encryption method for string
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

  // Decryption method for string
  public decryptText(encryptedTextAES: string, encryptedTextRC4: string, encryptedTextDES: string): Promise<[string, string, string]> {
    return new Promise ((resolve) => {
      const decryptedAES = CryptoJS.AES.decrypt(encryptedTextAES, this.key).toString(CryptoJS.enc.Utf8);
      const decryptedRC4 = CryptoJS.RC4.decrypt(encryptedTextRC4, this.key).toString(CryptoJS.enc.Utf8);
      const decryptedDES = CryptoJS.DES.decrypt(encryptedTextDES, this.key).toString(CryptoJS.enc.Utf8);
      resolve([decryptedAES, decryptedRC4, decryptedDES])
    }) ;
  }

  // Encryption method for video
  encryptVideo(videoTitle: string, videoBlob: Blob): Promise<string> {
    return new Promise ((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(videoBlob);
      fileReader.onload = () => {
        const arrayBuffer = fileReader.result as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        const encryptedAES = CryptoJS.AES.encrypt(wordArray, this.key).toString();
        const encryptedRC4 = CryptoJS.RC4.encrypt(wordArray, this.key).toString();
        const encryptedDES = CryptoJS.DES.encrypt(wordArray, this.key).toString();
        this.back.saveFile(this.getToken(), videoTitle, encryptedAES, encryptedRC4, encryptedDES).subscribe({
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

  // Encryption method for images
  encryptImage(imageTitle: string, imageBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      
      // Lire le Blob de l'image comme ArrayBuffer
      fileReader.readAsArrayBuffer(imageBlob);
      fileReader.onload = () => {
        // Créer un WordArray à partir de l'ArrayBuffer
        const arrayBuffer = fileReader.result as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  
        // Chiffrement AES
        const encryptedAES = CryptoJS.AES.encrypt(wordArray, this.key).toString();
        // Chiffrement RC4
        const encryptedRC4 = CryptoJS.RC4.encrypt(wordArray, this.key).toString();
        // Chiffrement DES
        const encryptedDES = CryptoJS.DES.encrypt(wordArray, this.key).toString();
  
        // Sauvegarde des données chiffrées via une requête backend
        this.back.saveFile(this.getToken(), imageTitle, encryptedAES, encryptedRC4, encryptedDES).subscribe({
          next: (body) => {
            resolve(body.message); // Résoudre la promesse avec le message de confirmation
          },
          error: (error) => {
            reject(error); // En cas d'erreur, rejeter la promesse avec l'erreur
          }
        });
      };
  
      fileReader.onerror = (error) => {
        reject('File reading error: ' + error);
      };
    });
  }
  

  // Encryption method for pdf or txt
  encryptFile(fileTitle: string, fileBlob: Blob): Promise<string> {
    return new Promise ((resolve, reject) => {
      // Check the name of the file to determine its type
      let fileName = "" ;
      if (fileBlob instanceof File) {
        fileName = fileBlob.name;
      } else {
        fileName = 'decrypted-file'; // Default name
      }
    
      const fileReader = new FileReader();
    
      // If the file is a pdf, read it as an ArrayBuffer
      if (fileBlob.type === 'application/pdf') {
        fileReader.readAsArrayBuffer(fileBlob);
        fileReader.onload = () => {
          const arrayBuffer = fileReader.result as ArrayBuffer;
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          const encryptedAES = CryptoJS.AES.encrypt(wordArray, this.key).toString();
          const encryptedRC4 = CryptoJS.RC4.encrypt(wordArray, this.key).toString();
          const encryptedDES = CryptoJS.DES.encrypt(wordArray, this.key).toString();
          console.log('encryption pdf : ' + encryptedAES) ;
          this.back.saveFile(this.getToken(), fileTitle, encryptedAES, encryptedRC4, encryptedDES).subscribe({
            next: (body) => {
              // resolve(body.message) ;
              resolve(encryptedAES) ;
            },
            error: (error) => {
              reject(error) ;
            }
          });
        };
      } else {
        // If the file is a text
        fileReader.readAsText(fileBlob);
        fileReader.onload = () => {
          const fileContent = fileReader.result as string;
          const encryptedAES = CryptoJS.AES.encrypt(fileContent, this.key).toString();
          const encryptedRC4 = CryptoJS.RC4.encrypt(fileContent, this.key).toString();
          const encryptedDES = CryptoJS.DES.encrypt(fileContent, this.key).toString();
          console.log('encryption txt : ' + encryptedAES) ;
          this.back.saveFile(this.getToken(), fileTitle, encryptedAES, encryptedRC4, encryptedDES).subscribe({
            next: (body) => {
              resolve(body.message) ;
            },
            error: (error) => {
              reject(error) ;
            }
          });
        };
      }
    }) ;
  }

  // Decrypt video
  // decryptVideo(encryptedVideoAES: string, encryptedVideoRC4: string, encryptedVideoDES: string): Promise<[string, string, string]> {
  //   return new Promise ((resolve) => {
  //     const decryptedAES = CryptoJS.AES.decrypt(encryptedVideoAES, this.key);
  //     const decryptedRC4 = CryptoJS.RC4.decrypt(encryptedVideoRC4, this.key);
  //     const decryptedDES = CryptoJS.DES.decrypt(encryptedVideoDES, this.key);
  //     const typedArrayAES = new Uint8Array(decryptedAES.sigBytes);
  //     const typedArrayRC4 = new Uint8Array(decryptedRC4.sigBytes);
  //     const typedArrayDES = new Uint8Array(decryptedDES.sigBytes);

  //     for (let i = 0; i < decryptedAES.sigBytes; i++) {
  //       typedArrayAES[i] = (decryptedAES.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  //     }
  //     for (let i = 0; i < decryptedRC4.sigBytes; i++) {
  //       typedArrayRC4[i] = (decryptedRC4.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  //     }
  //     for (let i = 0; i < decryptedDES.sigBytes; i++) {
  //       typedArrayDES[i] = (decryptedDES.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  //     }

  //     // Create a blob with decrypted data
  //     const decryptedBlobAES = new Blob([typedArrayAES], { type: 'video/mp4' });
  //     const decryptedBlobRC4 = new Blob([typedArrayRC4], { type: 'video/mp4' });
  //     const decryptedBlobDES = new Blob([typedArrayDES], { type: 'video/mp4' });

  //     // Revoke previous link
  //     if (this.downloadLinkAES) {
  //       URL.revokeObjectURL(this.downloadLinkAES);
  //     }
  //     if (this.downloadLinkRC4) {
  //       URL.revokeObjectURL(this.downloadLinkRC4);
  //     }
  //     if (this.downloadLinkDES) {
  //       URL.revokeObjectURL(this.downloadLinkDES);
  //     }

  //     // Create a new URL to download decrypted video
  //     this.downloadLinkAES = URL.createObjectURL(decryptedBlobAES);
  //     this.downloadLinkRC4 = URL.createObjectURL(decryptedBlobRC4);
  //     this.downloadLinkDES = URL.createObjectURL(decryptedBlobDES);
  //     resolve([this.downloadLinkAES, this.downloadLinkRC4, this.downloadLinkDES]) ;
  //   }) ;
  // }

  // Decrypt file
  decryptFile(encryptedFileAES: string, encryptedFileRC4: string, encryptedFileDES: string, fileName: string, fileType: string): Promise<[string, string, string]> {
    return new Promise((resolve, reject) => {
      try {
        // Sélection du type MIME en fonction du fichier
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
          mimeType = 'video/mp4'; // ou autre format vidéo
        } else {
          mimeType = 'application/pdf'; // Par défaut pour les PDF ou autres
        }
  
        // Déchiffrement AES
        const decryptedBlobAES = this.decryptAndConvertToBlob(encryptedFileAES, mimeType, 'AES');
        // Déchiffrement RC4
        const decryptedBlobRC4 = this.decryptAndConvertToBlob(encryptedFileRC4, mimeType, 'RC4');
        // Déchiffrement DES
        const decryptedBlobDES = this.decryptAndConvertToBlob(encryptedFileDES, mimeType, 'DES');
  
        // Création des URLs pour les fichiers décryptés
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
  
  // Fonction utilitaire pour gérer le déchiffrement et la conversion en Blob
  decryptAndConvertToBlob(encryptedData: string, mimeType: string, algorithm: string): Blob {
    let decryptedBytes;
    
    // Sélection de l'algorithme de déchiffrement
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
        throw new Error('Unsupported algorithm');
    }
  
    // Conversion des données déchiffrées en WordArray
    const decryptedWordArray = CryptoJS.lib.WordArray.create(decryptedBytes.words);
  
    // Création d'un ArrayBuffer à partir du WordArray
    const decryptedArrayBuffer = this.wordArrayToArrayBuffer(decryptedWordArray);
  
    // Retourner un Blob à partir de l'ArrayBuffer
    return new Blob([decryptedArrayBuffer], { type: mimeType });
  }
  
  // Fonction utilitaire pour convertir WordArray en ArrayBuffer
  wordArrayToArrayBuffer(wordArray: CryptoJS.lib.WordArray): ArrayBuffer {
    const arrayBuffer = new ArrayBuffer(wordArray.sigBytes);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < wordArray.sigBytes; i++) {
      uint8Array[i] = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    return arrayBuffer;
  }
  




  // // Encryption method for files
  // public encryptFile(file: File): Promise<[string, string, string]> {
  //   return new Promise((resolve, reject) => {
  //     // Encrypt the file using AES, RC4, and DES
  //     Promise.all([
  //       this.encryptFileAES(file),
  //       this.encryptFileRC4(file),
  //       this.encryptFileDES(file)
  //     ])
  //     .then((encryptedData) => {
  //       resolve(encryptedData);
  //     })
  //     .catch((error) => {
  //       reject(error);
  //     });
  //   });
  // }

  // public encryptFileAES(file: File): Promise<string> {
  //   return this.encryptFileWithAlgorithm(file, CryptoJS.AES);
  // }

  // public encryptFileRC4(file: File): Promise<string> {
  //   return this.encryptFileWithAlgorithm(file, CryptoJS.RC4);
  // }

  // public encryptFileDES(file: File): Promise<string> {
  //   return this.encryptFileWithAlgorithm(file, CryptoJS.DES);
  // }

  // // Helper function to encrypt a file with a given algorithm
  // private encryptFileWithAlgorithm(file: File, algorithm: any): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const fileReader = new FileReader();
  //     fileReader.onload = (event: any) => {
  //       const fileData = event.target.result;
  //       const encryptedData = algorithm.encrypt(fileData, this.key).toString();
  //       resolve(encryptedData);
  //     };
  //     fileReader.onerror = (error) => {
  //       reject(error);
  //     };
  //     fileReader.readAsDataURL(file);
  //   });
  // }

  // // Decryption method for files
  // public decryptFile(encryptedData: string, algorithmUsed: string): Promise<Uint8Array> {
  //   return new Promise((resolve, reject) => {
  //     // Decrypt using AES, then RC4, then DES
  //     let decryptedData: string;
  //     try {
  //       switch (algorithmUsed) {
  //         case "AES" : 
  //           decryptedData = this.decryptFileWithAlgorithm(encryptedData, CryptoJS.AES);
  //           break ;
  //         case "RC4" : 
  //           decryptedData = this.decryptFileWithAlgorithm(encryptedData, CryptoJS.RC4);
  //           break ;
  //         case "DES" : 
  //           decryptedData = this.decryptFileWithAlgorithm(encryptedData, CryptoJS.DES);
  //           break ;
  //         default:
  //           throw new Error("Unsupported algorithm");
  //       }
    
  //       // Convert the string into a tab of bytes (ArrayBuffer)
  //       const byteCharacters = atob(decryptedData); // Assuming base64 encoded string
  //       const byteNumbers = new Array(byteCharacters.length);
  //       for (let i = 0; i < byteCharacters.length; i++) {
  //         byteNumbers[i] = byteCharacters.charCodeAt(i);
  //       }
  //       const byteArray = new Uint8Array(byteNumbers);
  //       resolve(byteArray);
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // }

  // // Helper function to decrypt a string with a given algorithm
  // private decryptFileWithAlgorithm(encryptedData: string, algorithm: any): string {
  //   const decrypted = algorithm.decrypt(encryptedData, this.key).toString(CryptoJS.enc.Base64); // Ensure Base64 encoding
  //   return decrypted;
  // }
}

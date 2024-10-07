import { Component } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-encryption',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './video-encryption.component.html',
  styleUrl: './video-encryption.component.css'
})
export class VideoEncryptionComponent {
  encryptedVideo: string = ''; // Contenu crypté de la vidéo
  downloadLink: string | null = null; // URL de téléchargement pour la vidéo décryptée

  encryptedFile: string = ''; // Contenu crypté du fichier texte ou PDF
  fileDownloadLink: string | null = null; // URL de téléchargement pour le fichier décrypté
  fileName: string = ''; // Nom du fichier décrypté

  // Méthode appelée lors de la sélection d'un fichier
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileType = file.type.split('/')[0];
      
      if (fileType === 'video') {
        this.encryptVideo(file);
      } else if (fileType === 'application' || fileType === 'text') {
        this.encryptFile(file);
      }
    }
  }

  // Méthode pour crypter une vidéo
  encryptVideo(videoBlob: Blob) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(videoBlob);
    fileReader.onload = () => {
      const arrayBuffer = fileReader.result as ArrayBuffer;
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
      const encrypted = CryptoJS.AES.encrypt(wordArray, 'your-secret-key');
      this.encryptedVideo = encrypted.toString();
      console.log('Vidéo cryptée :', this.encryptedVideo);
    };
  }

  // Méthode pour crypter un fichier texte ou PDF
  encryptFile(fileBlob: Blob) {
    // Vérification du type et récupération du nom de fichier
    if (fileBlob instanceof File) {
      this.fileName = fileBlob.name;
    } else {
      this.fileName = 'decrypted-file'; // Nom par défaut si ce n'est pas un objet File
    }
  
    const fileReader = new FileReader();
  
    // Si le fichier est un PDF, lire en tant qu'ArrayBuffer, sinon en tant que texte
    if (fileBlob.type === 'application/pdf') {
      fileReader.readAsArrayBuffer(fileBlob);
      fileReader.onload = () => {
        const arrayBuffer = fileReader.result as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        const encrypted = CryptoJS.AES.encrypt(wordArray, 'your-secret-key');
        this.encryptedFile = encrypted.toString();
        console.log('Fichier PDF crypté :', this.encryptedFile);
      };
    } else {
      // Pour les fichiers texte
      fileReader.readAsText(fileBlob);
      fileReader.onload = () => {
        const fileContent = fileReader.result as string;
        const encrypted = CryptoJS.AES.encrypt(fileContent, 'your-secret-key');
        this.encryptedFile = encrypted.toString();
        console.log('Fichier texte crypté :', this.encryptedFile);
      };
    }
  }
  

  // Méthode pour décrypter la vidéo et générer un lien de téléchargement
  decryptVideo() {
    if (!this.encryptedVideo) return;

    const decrypted = CryptoJS.AES.decrypt(this.encryptedVideo, 'your-secret-key');
    const typedArray = new Uint8Array(decrypted.sigBytes);

    for (let i = 0; i < decrypted.sigBytes; i++) {
      typedArray[i] = (decrypted.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }

    // Crée un Blob avec les données décryptées
    const decryptedBlob = new Blob([typedArray], { type: 'video/mp4' });

    // Révoque l'ancienne URL pour libérer la mémoire
    if (this.downloadLink) {
      URL.revokeObjectURL(this.downloadLink);
    }

    // Crée un nouvel URL pour le téléchargement
    this.downloadLink = URL.createObjectURL(decryptedBlob);
  }

  // Méthode pour décrypter un fichier texte ou PDF et générer un lien de téléchargement
  decryptFile() {
    if (!this.encryptedFile) return;
  
    const decrypted = CryptoJS.AES.decrypt(this.encryptedFile, 'your-secret-key');
  
    // Si le fichier est un PDF, convertir en Uint8Array
    if (this.fileName.endsWith('.pdf')) {
      const typedArray = new Uint8Array(decrypted.sigBytes);
      for (let i = 0; i < decrypted.sigBytes; i++) {
        typedArray[i] = (decrypted.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      }
      // Crée un Blob avec les données décryptées en tant que PDF
      const decryptedBlob = new Blob([typedArray], { type: 'application/pdf' });
  
      // Révoque l'ancienne URL pour libérer la mémoire
      if (this.fileDownloadLink) {
        URL.revokeObjectURL(this.fileDownloadLink);
      }
  
      // Crée un nouvel URL pour le téléchargement
      this.fileDownloadLink = URL.createObjectURL(decryptedBlob);
    } else {
      // Pour les fichiers texte
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      const decryptedBlob = new Blob([decryptedText], { type: 'text/plain' });
  
      // Révoque l'ancienne URL pour libérer la mémoire
      if (this.fileDownloadLink) {
        URL.revokeObjectURL(this.fileDownloadLink);
      }
  
      // Crée un nouvel URL pour le téléchargement
      this.fileDownloadLink = URL.createObjectURL(decryptedBlob);
    }
  }
  

  // Méthode pour révoquer le lien de téléchargement
  revokeDownloadLink() {
    if (this.downloadLink) {
      URL.revokeObjectURL(this.downloadLink);
      this.downloadLink = null;
    }
  }

  // Méthode pour révoquer le lien de téléchargement du fichier
  revokeFileDownloadLink() {
    if (this.fileDownloadLink) {
      URL.revokeObjectURL(this.fileDownloadLink);
      this.fileDownloadLink = null;
    }
  }
  
  // encryptedDataImageAES: string = "";
  // encryptedDataImageRC4: string = "";
  // encryptedDataImageDES: string = "";
  // decryptedDataURLImage: string = "";

  // encryptedDataDocumentAES: string = "";
  // encryptedDataDocumentRC4: string = "";
  // encryptedDataDocumentDES: string = "";
  // decryptedDataURLDocument: string = "";

  // encryptedDataVideoAES: string = "" ;
  // encryptedDataVideoRC4: string = "" ;
  // encryptedDataVideoDES: string = "" ;
  // decryptedDataURLVideo: string = "" ;

  // // Encrypt selected image
  // onSelectedDataImage(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.encryptionService.encryptFile(file).then((data: any) => {
  //       [this.encryptedDataImageAES, this.encryptedDataImageRC4, this.encryptedDataImageDES] = data;
  //       console.log('Encrypted image data AES:', this.encryptedDataImageAES);
  //       console.log('Encrypted image data RC4:', this.encryptedDataImageRC4);
  //       console.log('Encrypted image data DES:', this.encryptedDataImageDES);
  //     }).catch((error: any) => {
  //       console.error('Encryption error:', error);
  //     });
  //   }
  // }

  // // Decrypt image
  // decryptDataImage() {
  //   if (this.decryptedDataURLImage) {
  //     URL.revokeObjectURL(this.decryptedDataURLImage);
  //   }
  //   if (this.encryptedDataImageAES) {
  //     this.encryptionService.decryptFile(this.encryptedDataImageAES, "AES").then((decryptedBuffer: Uint8Array) => {
  //       // To decrypt video
  //       const blob = new Blob([decryptedBuffer], { type: 'image/png' });
  //       // Generate an URL from the data
  //       this.decryptedDataURLImage = URL.createObjectURL(blob); 
  //       console.log('Data decrypted : ' + this.decryptedDataURLImage);
  //     }).catch((error: any) => {
  //       console.error('Decryption error:', error);
  //     });
  //   }
  // }

  // // Encrypt selected document (XML, PDF, XLS)
  // onSelectedDataDocument(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.encryptionService.encryptFile(file).then((data: any) => {
  //       [this.encryptedDataDocumentAES, this.encryptedDataDocumentRC4, this.encryptedDataDocumentDES] = data;
  //       console.log('Encrypted document data:', this.encryptedDataDocumentAES);
  //       console.log('Encrypted document data:', this.encryptedDataDocumentRC4);
  //       console.log('Encrypted document data:', this.encryptedDataDocumentDES);
  //     }).catch((error: any) => {
  //       console.error('Encryption error:', error);
  //     });
  //   }
  // }

  // // Decrypt document
  // decryptDataDocument() {
  //   if (this.encryptedDataDocumentAES) {
  //     this.encryptionService.decryptFile(this.encryptedDataDocumentAES, "AES").then((decryptedBuffer: Uint8Array) => {
  //       // To decrypt video
  //       const blob = new Blob([decryptedBuffer], { type: 'application/octet-stream' });
  //       // Generate an URL from the data
  //       this.decryptedDataURLDocument = URL.createObjectURL(blob); 
  //       console.log('Data decrypted :', this.encryptedDataDocumentAES);
  //     }).catch((error: any) => {
  //       console.error('Decryption error:', error);
  //     });
  //   }
  // }

  // // Encrypt a video
  // onSelectedDataVideo(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.encryptionService.encryptFile(file).then((data: any) => {
  //       [this.encryptedDataVideoAES, this.encryptedDataVideoRC4, this.encryptedDataVideoDES] = data;
  //       console.log('Encrypted data :', this.encryptedDataVideoAES);
  //       console.log('Encrypted data :', this.encryptedDataVideoRC4);
  //       console.log('Encrypted data :', this.encryptedDataVideoDES);
  //     }).catch((error: any) => {
  //       console.error('Encryption error :', error);
  //     });
  //   }
  // }

  // // Decrypt a video
  // decryptDataVideo() {
  //   if (this.encryptedDataVideoAES) {
  //     this.encryptionService.decryptFile(this.encryptedDataVideoAES, "AES").then((decryptedBuffer: Uint8Array) => {
  //       // To decrypt video
  //       const blob = new Blob([decryptedBuffer], { type: 'video/mp4' });
  //       // Generate an URL from the data
  //       this.decryptedDataURLVideo = URL.createObjectURL(blob); 
  //       console.log('Data decrypted :', this.encryptedDataVideoAES);
  //     }).catch((error: any) => {
  //       console.error('Decryption error:', error);
  //     });
  //   }
  // }
}

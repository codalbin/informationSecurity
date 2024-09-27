import { Injectable } from '@angular/core';
import { NgxIndexedDBService, DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { InjectableProvider } from '@angular/core';
import { Observable } from 'rxjs';

const dbConfig: DBConfig = {
  name: 'Database',
  version: 1,
  objectStoresMeta: [
    {
      store: 'users',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'username', keypath: 'username', options: { unique: true } },
        { name: 'password', keypath: 'password', options: { unique: false } }
      ]
    },
    {
      store: 'ID_card',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'username', keypath: 'username', options: { unique: true } },
        { name: 'data', keypath: 'data', options: { unique: false } }
      ]
    },
    {
      store: 'pdf_file',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'username', keypath: 'username', options: { unique: false } },
        { name: 'filename', keypath: 'filename', options: { unique: false } },
        { name: 'username_filename', keypath: ['username', 'filename'], options: { unique: true } },
        { name: 'data', keypath: 'data', options: { unique: false } }
      ]
    },
    {
      store: 'Doc_file',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'username', keypath: 'username', options: { unique: false } },
        { name: 'filename', keypath: 'filename', options: { unique: false } },
        { name: "username_filename", keypath: ['username', 'filename'], options: { unique: true } },
        { name: 'data', keypath: 'data', options: { unique: false } }
      ]
    },
    {
      store: 'XLS_file',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'username', keypath: 'username', options: { unique: false } },
        { name: 'filename', keypath: 'filename', options: { unique: false } },
        { name: "username_filename", keypath: ['username', 'filename'], options: { unique: true } },
        { name: 'data', keypath: 'data', options: { unique: false } }
      ]
    },
    {
      store: 'video_file',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'username', keypath: 'username', options: { unique: false } },
        { name: 'filename', keypath: 'filename', options: { unique: false } },
        { name: "username_filename", keypath: ['username', 'filename'], options: { unique: true } },
        { name: 'data', keypath: 'data', options: { unique: false } }
      ]
    }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private dbService: NgxIndexedDBService) { }

  addUser(username: string, password: string) {
    return this.dbService.add('users', { username: username, password: password });
  }

  getUser(username: string) {
    return this.dbService.getByIndex('users', 'username', username);
  }

  addIDCard(username: string, data: string) {
    return this.dbService.add('ID_card', { username: username, data: data });
  }

  getIDCard(username: string) {
    return this.dbService.getByIndex('ID_card', 'username', username);
  }

  addPDFFile(username: string, filename: string, data: string) {
    return this.dbService.add('pdf_file', { username: username, filename: filename, data: data });
  }

  getPDFFile(username: string, filename: string): Observable<PDFFile> {
    return this.dbService.getByIndex('pdf_file', 'username_filename', [username, filename]) as Observable<PDFFile>;
  }

  addDocFile(username: string, filename: string, data: string) {
    return this.dbService.add('Doc_file', { username: username, filename: filename, data: data });
  }

  getDocFile(username: string, filename: string) {
    return this.dbService.getByIndex('Doc_file', 'username_filename', [username, filename]);
  }

  addXLSFile(username: string, filename: string, data: string) {
    return this.dbService.add('XLS_file', { username: username, filename: filename, data: data });
  }

  getXLSFile(username: string, filename: string) {
    return this.dbService.getByIndex('XLS_file', 'username_filename', [username, filename]);
  }

  addVideoFile(username: string, filename: string, data: string) {
    return this.dbService.add('video_file', { username: username, filename: filename, data: data });
  }

  getVideoFile(username: string, filename: string) {
    return this.dbService.getByIndex('video_file', 'username_filename', [username, filename]);
  }
}

export interface PDFFile {
  username: string;
  filename: string;
  data: string;
}




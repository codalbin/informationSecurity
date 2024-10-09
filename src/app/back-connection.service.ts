import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackConnectionService {

  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Sign In
  signIn(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(`${this.baseUrl}/register`, body);
  }

  // Login
  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(`${this.baseUrl}/login`, body);
  }

  // Save a file
  saveFile(token: string, file_name: string, file_data_AES: string, file_data_RC4: string, file_data_DES: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const body = { file_name, file_data_AES, file_data_RC4, file_data_DES };
    return this.http.post(`${this.baseUrl}/files/add`, body, { headers });
  }

  // Delete a file
  deleteFile(token: string, file_name: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const body = { file_name };
    const httpOptions = {
      headers,
      body
    };
    return this.http.delete(`${this.baseUrl}/files/delete`, httpOptions);
  }

  // Get a file
  getOneFile(token: string, file_name: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(`${this.baseUrl}/files/${file_name}`, { headers });
  }

  // Get all files 
  getAllFiles(token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(`${this.baseUrl}/files`, { headers });
  }

  // Save a text
  saveText(token: string, text_name: string, text_data_AES: string, text_data_RC4: string, text_data_DES: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const body = { text_name, text_data_AES, text_data_RC4, text_data_DES };
    return this.http.post(`${this.baseUrl}/texts/add`, body, { headers });
  }

  // Delete a text
  deleteText(token: string, text_name: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const body = { text_name };
    const httpOptions = {
      headers,
      body
    };
    return this.http.delete(`${this.baseUrl}/texts/delete`, httpOptions);
  }

  // Get a text
  getOneText(token: string, text_name: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(`${this.baseUrl}/texts/${text_name}`, { headers });
  }

  // Get all texts
  getAllTexts(token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(`${this.baseUrl}/texts`, { headers });
  }
}

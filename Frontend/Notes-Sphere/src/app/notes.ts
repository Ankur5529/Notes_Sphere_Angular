import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private baseUrl = 'http://127.0.0.1:5000';  // Flask backend URL

  constructor(private http: HttpClient) {}

  // Login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password }, { withCredentials: true });
  }

  // Upload note
  uploadNote(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload_note`, formData, { withCredentials: true });
  }

  // Fetch notes
  getNotes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_notes`, { withCredentials: true });
  }
}

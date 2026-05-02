import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.adminUsersUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  saveSignature(userId: number, signatureBase64: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${userId}/signature`,
      { signature: signatureBase64 },
      { headers: this.getHeaders(), responseType: 'text' as 'json' }
    );
  }

  updateUserRole(userId: number, role: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/role`,
      { userId, role },
      { headers: this.getHeaders() }
    );
  }
}
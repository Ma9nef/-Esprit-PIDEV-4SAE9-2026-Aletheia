import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpHeaders
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   private apiUrl = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    // 1. Get the token from storage (make sure the key matches your login logic)
    const token = localStorage.getItem('token');

    // 2. Create the header

const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    // 3. Send the request with headers
    return this.http.get<any>(`${this.apiUrl}/admin/users`, { headers });
  }

  saveSignature(userId: number, signatureBase64: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/${userId}/signature`,
      { signature: signatureBase64 },
      { headers, responseType: 'text'as 'json' } // Expecting a plain text response
    );
  }

  updateUserRole(userId: number, role: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.apiUrl}/admin/users/role`,
      { userId, role },
      { headers }
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export type JwtUser = {
  id: number;
  email: string;
  role: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = 'http://localhost:8089/api/auth';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post<any>(`${this.API}/login`, data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.API}/register`, data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payloadPart = token.split('.')[1];
      const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '==='.slice((base64.length + 3) % 4);
      const payload = JSON.parse(atob(padded));
      return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // ✅ decode token payload (no library needed)
  getUserFromToken(): JwtUser | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payloadPart = token.split('.')[1];
      const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '==='.slice((base64.length + 3) % 4);
      const payloadJson = atob(padded);
      const payload = JSON.parse(payloadJson);

      return {
        id: Number(payload.id),
        email: String(payload.sub),     // subject = email
        role: String(payload.role)
      };
    } catch {
      return null;
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export type JwtUser = {
  id: number;
  email: string;
  role: string;
  prenom?: string; // first name (may be absent if token doesn't include it)
  nom?: string;    // last name
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = 'http://localhost:8080/api/auth';

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

  isLoggedIn() {
    return !!this.getToken();
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
        role: String(payload.role),
        prenom: payload.prenom ? String(payload.prenom) :
                payload.firstName ? String(payload.firstName) :
                payload.given_name ? String(payload.given_name) :
                undefined,
        nom: payload.nom ? String(payload.nom) :
             payload.lastName ? String(payload.lastName) :
             payload.family_name ? String(payload.family_name) :
             undefined
      };
    } catch {
      return null;
    }
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation } from '../models/formation.model';

@Injectable({
  providedIn: 'root'
})
export class AdminFormationService {
  private apiUrl = '/api/admin/formations';

  constructor(private http: HttpClient) {}

  private authHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      })
    };
  }

  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl, this.authHeaders());
  }

  getArchivedFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/archived`, this.authHeaders());
  }

  getActiveFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/active`, this.authHeaders());
  }

  archiveFormation(formationId: number): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${formationId}/archive`, {}, this.authHeaders());
  }

  unarchiveFormation(formationId: number): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${formationId}/unarchive`, {}, this.authHeaders());
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation } from '../models/formation.model';

@Injectable({
  providedIn: 'root'
})
export class AdminFormationService {
  private apiUrl = 'http://localhost:8089/api/admin/formations';

  constructor(private http: HttpClient) {}

  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }

  getArchivedFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/archived`);
  }

  getActiveFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/active`);
  }

  archiveFormation(formationId: number): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${formationId}/archive`, {});
  }

  unarchiveFormation(formationId: number): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${formationId}/unarchive`, {});
  }
}
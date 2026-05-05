import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation } from '../models/formation.model';

@Injectable({
  providedIn: 'root'
})
export class InstructorFormationService {
    private apiUrl = '/api/instructor/formations';

  constructor(private http: HttpClient) {}

  getMyFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/my`);
  }

  getFormationById(formationId: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${formationId}`);
  }

  createFormation(payload: Formation): Observable<Formation> {
    return this.http.post<Formation>(this.apiUrl, payload);
  }

  updateFormation(formationId: number, payload: Formation): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${formationId}`, payload);
  }
}
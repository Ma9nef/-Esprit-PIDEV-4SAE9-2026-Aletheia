import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation } from '../models/formation.model';
import { FormationEnrollment } from '../models/formation-enrollment.model';

@Injectable({
  providedIn: 'root'
})
export class FormationPublicService {

  private readonly apiUrl = '/api/formations';

  constructor(private http: HttpClient) {}

  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }

  getFormationById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${id}`);
  }

  enrollInFormation(formationId: number, userId: number): Observable<FormationEnrollment> {
    return this.http.post<FormationEnrollment>(
      `${this.apiUrl}/${formationId}/enroll`,
      null,
      {
        params: {
          userId: userId.toString()
        }
      }
    );
  }

  getMyEnrollments(userId: number): Observable<FormationEnrollment[]> {
    return this.http.get<FormationEnrollment[]>(
      `${this.apiUrl}/my-enrollments`,
      {
        params: {
          userId: userId.toString()
        }
      }
    );
  }
}
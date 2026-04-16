import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation } from '../models/formation.model';
import { FormationEnrollment } from '../models/formation-enrollment.model';
import { MyEnrolledFormation } from '../models/my-enrolled-formation.model';
import { FormationSession } from '../models/formation-session.model';
import { FormationAttendanceSummary } from '../models/formation-attendance.model';

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

  enrollInFormation(formationId: number): Observable<FormationEnrollment> {
    return this.http.post<FormationEnrollment>(
      `${this.apiUrl}/${formationId}/enroll`,
      null
    );
  }

  getMyEnrolledFormations(): Observable<MyEnrolledFormation[]> {
    return this.http.get<MyEnrolledFormation[]>(
      `${this.apiUrl}/my-enrollments`
    );
  }

  getFormationSessions(formationId: number): Observable<FormationSession[]> {
    return this.http.get<FormationSession[]>(
      `${this.apiUrl}/${formationId}/sessions`
    );
  }

  getMyAttendance(formationId: number): Observable<FormationAttendanceSummary> {
    return this.http.get<FormationAttendanceSummary>(
      `${this.apiUrl}/${formationId}/attendance/me`
    );
  }
}
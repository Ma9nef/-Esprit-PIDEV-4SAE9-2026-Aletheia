import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { FormationSession } from '../models/formation-session.model';

@Injectable({
  providedIn: 'root'
})
export class InstructorFormationSessionService {
  private apiUrl = 'http://localhost:8089/api/instructor/formations';

  constructor(private http: HttpClient) {}

  private mapSession(session: any): FormationSession {
    return {
      id: session.id,
      formationId: session.formationId ?? session.formation?.id ?? 0,
      sessionDate: session.sessionDate,
      startTime: session.startTime,
      endTime: session.endTime,
      room: session.room,
      topic: session.topic
    };
  }

  getSessionsByFormation(formationId: number): Observable<FormationSession[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/${formationId}/sessions`)
      .pipe(map(items => items.map(item => this.mapSession(item))));
  }

  getSessionById(sessionId: number): Observable<FormationSession> {
    return this.http
      .get<any>(`${this.apiUrl}/sessions/${sessionId}`)
      .pipe(map(item => this.mapSession(item)));
  }

  createSession(formationId: number, payload: FormationSession): Observable<FormationSession> {
    return this.http
      .post<any>(`${this.apiUrl}/${formationId}/sessions`, payload)
      .pipe(map(item => this.mapSession(item)));
  }

  updateSession(sessionId: number, payload: FormationSession): Observable<FormationSession> {
    return this.http
      .put<any>(`${this.apiUrl}/sessions/${sessionId}`, payload)
      .pipe(map(item => this.mapSession(item)));
  }

  deleteSession(sessionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sessions/${sessionId}`);
  }
}
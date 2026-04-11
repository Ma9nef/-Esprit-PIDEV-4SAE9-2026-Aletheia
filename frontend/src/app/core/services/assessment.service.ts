import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assessment } from '../models/assessment.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private assessmentUrl = 'http://localhost:8089/pidev/assessment';
  private submissionUrl = 'http://localhost:8089/api/assessment-results';

  constructor(private http: HttpClient) {}

  saveAssessmentResult(payload: any): Observable<any> {
    return this.http.post(this.submissionUrl, payload, {
      headers: this.getHeaders()
    });
  }

  getAllAssessments(): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.assessmentUrl}/all`, {
      headers: this.getHeaders()
    });
  }

  getAssessmentById(id: number): Observable<Assessment> {
    return this.http.get<Assessment>(`${this.assessmentUrl}/get/${id}`, {
      headers: this.getHeaders()
    });
  }

  createAssessment(assessment: any): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.assessmentUrl}/add`, assessment, {
      headers: this.getHeaders()
    });
  }

  updateAssessment(id: number, assessment: any): Observable<Assessment> {
    return this.http.put<Assessment>(`${this.assessmentUrl}/update/${id}`, assessment, {
      headers: this.getHeaders()
    });
  }

  deleteAssessment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.assessmentUrl}/delete/${id}`, {
      headers: this.getHeaders()
    });
  }

  submitQuiz(id: number, answers: any): Observable<any> {
    return this.http.post(`${this.assessmentUrl}/${id}/submit`, answers, {
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}

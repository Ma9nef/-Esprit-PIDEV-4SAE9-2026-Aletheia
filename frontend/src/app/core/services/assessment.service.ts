import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assessment } from '../models/assessment.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private apiUrl = 'http://localhost:8089/api/pidev/assessment';

  saveAssessmentResult(payload: any): Observable<any> {
    return this.http.post(`http://localhost:8089/api/assessment-results`, payload);
  }

  constructor(private http: HttpClient) {}

  // Added /all
  getAllAssessments(): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.apiUrl}/all`);
  }

  // Added /get/
  getAssessmentById(id: number): Observable<Assessment> {
    return this.http.get<Assessment>(`${this.apiUrl}/get/${id}`);
  }

  // Added /add
  createAssessment(assessment: any): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.apiUrl}/add`, assessment);
  }

  // Added /update/
  updateAssessment(id: number, assessment: any): Observable<Assessment> {
    return this.http.put<Assessment>(`${this.apiUrl}/update/${id}`, assessment);
  }

  // Added /delete/
  deleteAssessment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }


}

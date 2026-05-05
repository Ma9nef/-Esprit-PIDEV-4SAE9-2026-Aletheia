import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Submission } from '../models/Submission.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubmissionService {
  private submissionUrl = '/api/assessment-results';

  constructor(private http: HttpClient) {}

  getAllSubmissions(): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${this.submissionUrl}/all`, {
      headers: this.getHeaders()
    });
  }

  deleteSubmission(id: number): Observable<any> {
    return this.http.delete(`${this.submissionUrl}/delete/${id}`, {
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
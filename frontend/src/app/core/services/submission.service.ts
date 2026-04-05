import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Submission } from '../models/Submission.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubmissionService {
  private baseUrl = 'http://localhost:8089/api/assessment-results'; // ✅ base without /all
  private apiUrl  = `${this.baseUrl}/all`;                          // ✅ used only for GET

  constructor(private http: HttpClient) {}

  getAllSubmissions(): Observable<Submission[]> {
    return this.http.get<Submission[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  deleteSubmission(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { // ✅ now resolves correctly
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
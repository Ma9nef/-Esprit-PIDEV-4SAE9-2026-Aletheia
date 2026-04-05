import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Submission } from '../models/Submission.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SubmissionService {
  private apiUrl = 'http://localhost:8089/api/assessment-results/all';

  constructor(private http: HttpClient) {}

  getAllSubmissions() {
    // Get token from localStorage (wherever you store it after login)
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Submission[]>(this.apiUrl, { headers });
  }
}
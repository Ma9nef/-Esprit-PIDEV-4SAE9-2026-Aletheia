import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private API = 'http://localhost:8089/course/public/enrollments';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  enroll(courseId: number) {
    return this.http.post(
      `${this.API}/${courseId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  getAllEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(this.API, {
      headers: this.getHeaders()
    });
  }

  myEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.API}/me`,
      { headers: this.getHeaders() }
    );
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private API = 'http://localhost:8081/course/public/enrollments';

  constructor(private http: HttpClient) {}

  enroll(courseId: number) {
    return this.http.post(`${this.API}/${courseId}`, {});
  }
  getAllEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(this.API); 
  }

  myEnrollments() {
    return this.http.get<any[]>(`${this.API}/me`);
  }
}
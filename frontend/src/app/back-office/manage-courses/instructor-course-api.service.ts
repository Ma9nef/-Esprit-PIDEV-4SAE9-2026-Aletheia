import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export type CourseAdminDTO = {
  id: number;
  title: string;
  description: string;
  price: number;
  durationHours: number;
  createdAt?: string;
};

export type CourseCreateDTO = {
  title: string;
  description: string;
  price: number;
  durationHours: number;
};

export type CourseUpdateDTO = CourseCreateDTO;

@Injectable({ providedIn: 'root' })
export class InstructorCourseApiService {
  private API = 'http://localhost:8081/instructor/courses';

  constructor(private http: HttpClient) {}

  private authHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');

    // Si token null => on envoie quand même, mais ça finira en 401 (normal)
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }),
    };
  }

  listMine(): Observable<CourseAdminDTO[]> {
    return this.http.get<CourseAdminDTO[]>(this.API, this.authHeaders());
  }

  create(dto: CourseCreateDTO): Observable<CourseAdminDTO> {
    return this.http.post<CourseAdminDTO>(this.API, dto, this.authHeaders());
  }

  update(id: number, dto: CourseUpdateDTO): Observable<CourseAdminDTO> {
    return this.http.put<CourseAdminDTO>(`${this.API}/${id}`, dto, this.authHeaders());
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`, this.authHeaders());
  }
}
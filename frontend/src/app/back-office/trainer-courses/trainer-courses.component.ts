import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

type InstructorCourseRowDTO = {
  courseId: number;
  title: string;
  enrollments: number;
  archived: boolean;
};

@Component({
  standalone: false,
  selector: 'app-trainer-courses',
  templateUrl: './trainer-courses.component.html',
  styleUrls: ['./trainer-courses.component.css']
})
export class TrainerCoursesComponent implements OnInit {

  courses: InstructorCourseRowDTO[] = [];
  loading = true;
  error: string | null = null;

  private API = '/api/instructor/dashboard/courses';
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });

    this.http.get<InstructorCourseRowDTO[]>(this.API, { headers }).subscribe({
      next: (res) => {
        this.courses = res ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load trainer courses';
        this.loading = false;
      }
    });
  }
}
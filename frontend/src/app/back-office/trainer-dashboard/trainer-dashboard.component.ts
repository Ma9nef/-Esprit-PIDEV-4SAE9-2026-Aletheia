import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

type InstructorStatsDTO = {
  totalStudents: number;
  activeCourses: number;
};

type InstructorCourseRowDTO = {
  courseId: number;
  title: string;
  enrollments: number;
  archived: boolean; // true => Draft/Archived, false => Active
};

@Component({
  selector: 'app-trainer-dashboard',
  templateUrl: './trainer-dashboard.component.html',
  styleUrls: ['./trainer-dashboard.component.css']
})
export class TrainerDashboardComponent implements OnInit {

  totalStudents = 0;
  activeCourses = 0;

  loadingStats = true;
  statsError: string | null = null;

  coursesRows: InstructorCourseRowDTO[] = [];
  loadingCourses = true;
  coursesError: string | null = null;

  private STATS_API = '/api/instructor/dashboard/stats';
  private COURSES_API = '/api/instructor/dashboard/courses';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadCourses();
  }

  private authHeaders(): HttpHeaders {
    console.log('TOKEN =', localStorage.getItem('token'));
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  private loadStats(): void {
    this.loadingStats = true;
    this.statsError = null;

    this.http.get<InstructorStatsDTO>(this.STATS_API, { headers: this.authHeaders() }).subscribe({
      next: (res) => {
        this.totalStudents = res?.totalStudents ?? 0;
        this.activeCourses = res?.activeCourses ?? 0;
        this.loadingStats = false;
      },
      error: (err) => {
        this.loadingStats = false;
        this.statsError = err?.error?.message || 'Failed to load stats (CORS/401?)';
      }
    });
  }

  private loadCourses(): void {
    this.loadingCourses = true;
    this.coursesError = null;

    this.http.get<InstructorCourseRowDTO[]>(this.COURSES_API, { headers: this.authHeaders() }).subscribe({
      next: (rows) => {
        this.coursesRows = Array.isArray(rows) ? rows : [];
        this.loadingCourses = false;
      },
      error: (err) => {
        this.loadingCourses = false;
        this.coursesError = err?.error?.message || 'Failed to load courses (CORS/401?)';
      }
    });
  }

  // UI helper
  getStatusLabel(row: InstructorCourseRowDTO): string {
    return row.archived ? 'Draft' : 'Active';
  }

  getStatusClass(row: InstructorCourseRowDTO): string {
    return row.archived ? 'status--draft' : 'status--active';
  }
}

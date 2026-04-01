import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

type CourseAdminDTO = {
  id: number;
  title: string;
  description: string;
  instructorName?: string;
  price: number;
  durationHours: number;
  imageUrl?: string | null;
  archived?: boolean;
  createdAt?: string;
};

type LessonAdminDTO = {
  id: number;
  courseId: number;
  title: string;
  contentText?: string | null;
  youtubeVideoId?: string | null;
  hasPdf: boolean;
};

@Component({
  selector: 'app-course-builder',
  templateUrl: './course-builder.component.html',
  styleUrls: ['./course-builder.component.css']
})
export class CourseBuilderComponent implements OnInit {
  courseId!: number;

  loading = false;
  error: string | null = null;

  course: CourseAdminDTO | null = null;
  lessons: LessonAdminDTO[] = [];

  private readonly COURSE_API = '/api/instructor/courses';
  private readonly LESSONS_BY_COURSE_API = '/api/lesson/instructor/by-course';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));

    if (!this.courseId || Number.isNaN(this.courseId)) {
      this.error = 'Missing courseId in route.';
      return;
    }

    this.loadAll();
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  loadAll(): void {
    this.loading = true;
    this.error = null;

    // Load course details
    this.http.get<CourseAdminDTO>(`${this.COURSE_API}/${this.courseId}`, { headers: this.authHeaders() })
      .subscribe({
        next: (c) => {
          this.course = c;

          // Load lessons after course loads
          this.http.get<LessonAdminDTO[]>(`${this.LESSONS_BY_COURSE_API}/${this.courseId}`, { headers: this.authHeaders() })
            .subscribe({
              next: (list) => {
                this.lessons = Array.isArray(list) ? list : [];
                this.loading = false;
              },
              error: (err) => {
                this.loading = false;
                this.error = err?.error?.message || err?.message || 'Failed to load lessons.';
              }
            });
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || err?.message || 'Failed to load course.';
        }
      });
  }

  goCreateLesson(): void {
    this.router.navigate(['/back-office/trainer/courses', this.courseId, 'lessons', 'create']);
  }

  backToCourses(): void {
    this.router.navigate(['/back-office/trainer/manage-courses']);
  }
  onImageError(event: any) {
    event.target.src = 'assets/images/course-placeholder.jpg';
  }
}
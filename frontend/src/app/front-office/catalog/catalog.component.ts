import { Component, OnInit } from '@angular/core';
import { CourseApiService, CoursePublicDTO } from '../../core/services/course-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  courses: CoursePublicDTO[] = [];
  loading = false;
  error = '';

  enrolledCourseIds = new Set<number>();
  enrollingId: number | null = null;

  constructor(
    private courseApi: CourseApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;

    // 1️⃣ Load courses
    this.courseApi.getAllPublicCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load courses.';
        this.loading = false;
      }
    });

    // 2️⃣ Load enrollments (ignore 401)
    this.courseApi.myEnrollments().subscribe({
      next: (enrollments) => {
        enrollments.forEach(e => {
          const id = e.course?.id ?? e.courseId;
          if (id) this.enrolledCourseIds.add(id);
        });
      },
      error: () => {
        // not logged in -> ignore
      }
    });
  }

  // 🔹 View course details
  open(courseId: number): void {
    this.router.navigate(['/front/course-details', courseId]);
  }

  // 🔹 Continue learning
  continueLearning(courseId: number): void {
    this.router.navigate(['/front/courses', courseId, 'learn']);
  }

  // 🔹 Enroll
  enroll(courseId: number): void {
    if (this.enrolledCourseIds.has(courseId)) return;

    this.enrollingId = courseId;

    this.courseApi.enroll(courseId).subscribe({
      next: () => {
        this.enrolledCourseIds.add(courseId);
        this.enrollingId = null;

        // ✅ After enrollment → go directly to lessons
        this.continueLearning(courseId);
      },
      error: (err) => {
        this.enrollingId = null;

        if (err.status === 401) {
          this.router.navigate(['/auth/login']);
          return;
        }

        if (err.status === 409) {
          this.enrolledCourseIds.add(courseId);
          this.continueLearning(courseId);
          return;
        }

        this.error = 'Enrollment failed.';
      }
    });
  }
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/course-placeholder.jpg';
  }
}

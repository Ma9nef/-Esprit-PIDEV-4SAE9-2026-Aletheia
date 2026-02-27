import { Component, OnInit } from '@angular/core';
import { CourseApiService, CoursePublicDTO } from '../../core/services/course-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html'
})
export class CatalogComponent implements OnInit {

  courses: CoursePublicDTO[] = [];
  loading = false;
  error = '';

  enrolledCourseIds = new Set<number>();
  enrollingId: number | null = null;

  constructor(private courseApi: CourseApiService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;

    // 1) Load courses
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

    // 2) Load my enrollments (ignore 401 if not logged in)
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

  open(courseId: number): void {
    this.router.navigate(['/front/course-details', courseId]);
  }

  enroll(courseId: number): void {
    if (this.enrolledCourseIds.has(courseId)) return;

    this.enrollingId = courseId;

    this.courseApi.enroll(courseId).subscribe({
      next: () => {
        // ✅ Mark as enrolled -> template will remove the Enroll button
        this.enrolledCourseIds.add(courseId);
        this.enrollingId = null;
      },
      error: (err) => {
        this.enrollingId = null;

        if (err.status === 401) {
          this.router.navigate(['/auth/login']); // adapte si besoin
          return;
        }

        if (err.status === 409) {
          // already enrolled -> reflect it in UI
          this.enrolledCourseIds.add(courseId);
          return;
        }

        this.error = 'Enrollment failed.';
      }
    });
  }
}
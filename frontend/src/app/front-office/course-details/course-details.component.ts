import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseApiService, CoursePublicDTO } from '../../core/services/course-api.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html'
})
export class CourseDetailsComponent implements OnInit {

  course: CoursePublicDTO | null = null;
  loading = false;
  error = '';

  isEnrolled = false;
  enrolling = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseApi: CourseApiService
  ) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (!courseId) {
      this.router.navigate(['/front/courses']);
      return;
    }

    this.loading = true;

    this.courseApi.getPublicCourse(courseId).subscribe({
      next: (data) => {
        this.course = data;
        this.loading = false;

        // Check enrollment after course is loaded
        this.checkEnrollment(courseId);
      },
      error: () => {
        this.error = 'Course not found.';
        this.loading = false;
      }
    });
  }

  private checkEnrollment(courseId: number): void {
    this.courseApi.myEnrollments().subscribe({
      next: (enrollments) => {
        const enrolled = enrollments.some(e => (e.course?.id ?? e.courseId) === courseId);

        if (enrolled) {
          this.isEnrolled = true;
          // ✅ redirect directly to learning
          this.router.navigate(['/front/courses', courseId, 'learn']);
        }
      },
      error: () => {
        // not logged in -> ignore
      }
    });
  }

  enroll(): void {
    if (!this.course || this.isEnrolled) return;

    this.enrolling = true;
    const courseId = this.course.id;

    this.courseApi.enroll(courseId).subscribe({
      next: () => {
        this.isEnrolled = true;
        this.enrolling = false;

        // ✅ redirect to learning
        this.router.navigate(['/front/courses', courseId, 'learn']);
      },
      error: (err) => {
        this.enrolling = false;

        if (err.status === 401) {
          this.router.navigate(['/auth/login']);
          return;
        }

        if (err.status === 409) {
          // already enrolled -> redirect anyway
          this.isEnrolled = true;
          this.router.navigate(['/front/courses', courseId, 'learn']);
          return;
        }

        this.error = 'Enrollment failed.';
      }
    });
  }

  back(): void {
    this.router.navigate(['/front/courses']);
  }
}
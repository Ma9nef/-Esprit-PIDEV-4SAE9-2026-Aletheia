import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CourseApiService,
  CoursePublicDTO,
  EnrollmentDTO
} from '../../core/services/course-api.service';

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
      next: (enrollments: EnrollmentDTO[]) => {
        this.isEnrolled = enrollments.some(e =>
          (e.course?.id ?? e.courseId) === courseId
        );
      },
      error: () => {
        // not logged in -> ignore
      }
    });
  }

  enroll(): void {
    if (!this.course || this.enrolling) return;

    this.enrolling = true;

    this.courseApi.enroll(this.course.id).subscribe({
      next: () => {
        this.isEnrolled = true;
        this.enrolling = false;

        // ✅ after enroll → go to lessons
        this.goToLearning();
      },
      error: (err) => {
        this.enrolling = false;

        if (err.status === 401) {
          this.router.navigate(['/auth/login']);
          return;
        }

        if (err.status === 409) {
          // already enrolled
          this.isEnrolled = true;
          this.goToLearning();
          return;
        }

        this.error = 'Enrollment failed.';
      }
    });
  }

  goToLearning(): void {
    if (!this.course) return;

    this.router.navigate(['/front/courses', this.course.id, 'learn']);
  }

  back(): void {
    this.router.navigate(['/front/courses']);
  }
}
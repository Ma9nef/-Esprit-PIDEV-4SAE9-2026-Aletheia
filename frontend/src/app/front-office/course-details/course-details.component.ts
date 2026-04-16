import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  CourseApiService,
  CoursePublicDTO,
  EnrollmentDTO
} from '../../core/services/course-api.service';

// ✅ UI-only extension (won't break even if backend doesn't send them yet)
type CourseDetailsVM = CoursePublicDTO & {
  category?: string | null;
  subCategory?: string | null;
};

@Component({
  standalone: false,
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'] // ✅ ensure your premium CSS loads
})
export class CourseDetailsComponent implements OnInit, OnDestroy {

  course: CourseDetailsVM | null = null;

  loading = false;
  error = '';

  isEnrolled = false;
  enrolling = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseApi: CourseApiService
  ) {}

  ngOnInit(): void {
    // ✅ react to route changes (safer than snapshot)
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(pm => {
        const courseId = Number(pm.get('id'));
        if (!courseId || Number.isNaN(courseId)) {
          this.router.navigate(['/front/courses']);
          return;
        }
        this.loadCourse(courseId);
      });
  }

  private loadCourse(courseId: number): void {
    this.loading = true;
    this.error = '';
    this.course = null;
    this.isEnrolled = false;

    this.courseApi.getPublicCourse(courseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.course = data as CourseDetailsVM;
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
    this.courseApi.myEnrollments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (enrollments: EnrollmentDTO[]) => {
          this.isEnrolled = enrollments.some(e => {
            const id = e.course?.id ?? e.courseId;
            return id === courseId;
          });
        },
        error: () => {
          // not logged in -> ignore
          this.isEnrolled = false;
        }
      });
  }

  enroll(): void {
    if (!this.course || this.enrolling) return;

    this.enrolling = true;
    this.error = '';

    this.courseApi.enroll(this.course.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isEnrolled = true;
          this.enrolling = false;
          this.goToLearning();
        },
        error: (err) => {
          this.enrolling = false;

          if (err?.status === 401) {
            this.router.navigate(['/auth/login']);
            return;
          }

          if (err?.status === 409) {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

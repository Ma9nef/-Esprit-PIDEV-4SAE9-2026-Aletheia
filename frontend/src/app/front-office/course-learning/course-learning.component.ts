import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseApiService, LessonLearningDTO } from '../../core/services/course-api.service';

@Component({
  selector: 'app-course-learning',
  templateUrl: './course-learning.component.html'
})
export class CourseLearningComponent implements OnInit {
  courseId!: number;

  lessons: LessonLearningDTO[] = [];
  selectedLesson: LessonLearningDTO | null = null;

  loadingList = false;
  loadingLesson = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: CourseApiService
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.courseId) {
      this.router.navigate(['/front/courses']);
      return;
    }

    this.loadLessonsAndOpenFirst();
  }

  private loadLessonsAndOpenFirst(): void {
    this.loadingList = true;
    this.error = '';

    this.api.listLessonsByCourse(this.courseId).subscribe({
      next: (data) => {
        // Tri optionnel si tu as orderIndex
        this.lessons = [...data].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        this.loadingList = false;

        if (this.lessons.length === 0) {
          this.selectedLesson = null;
          return;
        }

        this.openLesson(this.lessons[0].id);
      },
      error: () => {
        this.loadingList = false;
        this.error = 'Failed to load lessons.';
      }
    });
  }

  openLesson(lessonId: number): void {
    this.loadingLesson = true;
    this.error = '';

    this.api.getLesson(lessonId).subscribe({
      next: (lesson) => {
        this.selectedLesson = lesson;
        this.loadingLesson = false;
      },
      error: () => {
        this.loadingLesson = false;
        this.error = 'Lesson not found.';
      }
    });
  }

  backToCatalog(): void {
    this.router.navigate(['/front/courses']);
  }
}
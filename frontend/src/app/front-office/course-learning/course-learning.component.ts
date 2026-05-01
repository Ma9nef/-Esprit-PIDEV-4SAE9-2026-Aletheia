import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseApiService, LessonLearningDTO, CourseProgressDTO } from '../../core/services/course-api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  standalone: false,
  selector: 'app-course-learning',
  templateUrl: './course-learning.component.html',
  styleUrls: ['./course-learning.component.css']
})
export class CourseLearningComponent implements OnInit {

  courseId!: number;

  lessons: LessonLearningDTO[] = [];
  selectedLesson: LessonLearningDTO | null = null;

  loadingList = false;
  loadingLesson = false;
  loadingProgress = false;

  error = '';

  progress: CourseProgressDTO | null = null;

  safeYoutubeEmbedUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseApi: CourseApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    console.log('CourseLearning ngOnInit fired');

    const raw =
      this.route.snapshot.paramMap.get('courseId') ??
      this.route.snapshot.paramMap.get('id');

    const id = Number(raw);

    if (!id || Number.isNaN(id)) {
      this.error = `Invalid courseId in URL: "${raw}"`;
      return;
    }

    this.courseId = id;

    // Load data
    this.loadLessons();
    this.loadProgress();
  }

  backToCatalog(): void {
    this.router.navigate(['/front/courses']);
  }

  private loadProgress(): void {
    this.loadingProgress = true;

    this.courseApi.getCourseProgress(this.courseId).subscribe({
      next: (p) => {
        this.progress = p;
        this.loadingProgress = false;
      },
      error: (err) => {
        this.loadingProgress = false;
        // Ne bloque pas l’écran si progress échoue, mais on garde une trace
        console.error('Failed to load progress', err);
      }
    });
  }

  private loadLessons(): void {
    this.error = '';
    this.loadingList = true;

    this.courseApi.listLessonsByCourse(this.courseId).subscribe({
      next: (lessons) => {
        this.lessons = this.courseApi.sortLessons(lessons);
        this.loadingList = false;

        if (this.lessons.length) {
          // For now: open first lesson (later: resume with lastLessonId)
          this.openLesson(this.lessons[0].id);
        } else {
          this.selectedLesson = null;
          this.safeYoutubeEmbedUrl = null;
        }
      },
      error: (err) => {
        this.loadingList = false;
        this.error = err?.error?.message || `Failed to load lessons for courseId=${this.courseId}`;
      }
    });
  }

  openLesson(lessonId: number): void {
    this.error = '';
    this.loadingLesson = true;

    this.courseApi.getLesson(lessonId).subscribe({
      next: (lesson) => {
        this.selectedLesson = lesson;
        this.loadingLesson = false;

        this.safeYoutubeEmbedUrl = this.buildSafeYoutubeEmbedUrl(lesson);

        // optional (only if backend exists)
        // this.courseApi.openLesson(this.courseId, lessonId).subscribe({ next: () => {}, error: () => {} });
      },
      error: (err) => {
        this.loadingLesson = false;
        this.error = err?.error?.message || `Failed to open lessonId=${lessonId}`;
      }
    });
  }

  private buildSafeYoutubeEmbedUrl(lesson: LessonLearningDTO): SafeResourceUrl | null {
    const youtubeId = (lesson as any).youtubeVideoId as string | undefined;
    if (!youtubeId) return null;

    const url = `https://www.youtube.com/embed/${youtubeId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // -----------------------
  // ✅ Next / Previous (with backend progress via JWT)
  // -----------------------
  get currentIndex(): number {
    if (!this.selectedLesson) return -1;
    return this.lessons.findIndex(l => l.id === this.selectedLesson!.id);
  }

  get hasPrev(): boolean {
    return this.currentIndex > 0;
  }

  get hasNext(): boolean {
    return this.currentIndex >= 0 && this.currentIndex < this.lessons.length - 1;
  }

  prevLesson(): void {
    if (!this.hasPrev) return;
    const prev = this.lessons[this.currentIndex - 1];
    this.openLesson(prev.id);
  }

  nextLesson(): void {
    if (!this.hasNext || !this.selectedLesson) return;

    const currentLessonId = this.selectedLesson.id;
    const next = this.lessons[this.currentIndex + 1];

    // ✅ complete current, then open next
    this.courseApi.completeLesson(this.courseId, currentLessonId).subscribe({
      next: (p) => {
        this.progress = p;
        this.openLesson(next.id);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to save progress. Please retry.';
      }
    });
  }

  // Helpers for template
  get percent(): number {
    return this.progress?.percent ?? 0;
  }

  get completedLessons(): number {
    return this.progress?.completedLessons ?? 0;
  }

  get totalLessons(): number {
    return this.progress?.totalLessons ?? (this.lessons?.length ?? 0);
  }
}
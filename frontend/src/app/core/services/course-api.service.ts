import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CourseAdminDTO {
  id: number;
  title: string;
  description: string;
  instructorName: string;
  price: number;
  durationHours: number;
  archived: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CoursePublicDTO {
  id: number;
  title: string;
  description: string;
  instructorName: string;
  price: number;
  durationHours: number;
  createdAt: string;
  imageUrl?: string;
  category?: string | null;
  subCategory?: string | null;
}

export interface LessonLearningDTO {
  id: number;
  courseId?: number;
  title: string;
  contentText?: string;
  youtubeVideoId?: string;
  hasPdf?: boolean;
  orderIndex?: number;
  durationMinutes?: number;
}

export interface CourseProgressDTO {
  percent: number;
  completedLessons: number;
  totalLessons: number;
  lastLessonId?: number | null;
}

export interface EnrollmentDTO {
  id: number;
  enrolledAt?: string;
  course?: { id: number };
  courseId?: number;
}

@Injectable({ providedIn: 'root' })
export class CourseApiService {
  private COURSE_API = 'http://localhost:8089/course/public/courses';
  private ENROLL_API = 'http://localhost:8089/course/public/enrollments';
  private LESSON_LEARN_API = 'http://localhost:8089/api/lesson/learn';
  private ADMIN_COURSE_API = 'http://localhost:8089/course/admin/courses';
private PROGRESS_API = 'http://localhost:8089/course/progress';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('access_token') ||
      localStorage.getItem('jwt') ||
      localStorage.getItem('authToken');
  
    if (!token) {
      console.warn('No JWT token found in localStorage');
      return new HttpHeaders();
    }
  
    return new HttpHeaders({
      Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`
    });
  }

  getAllPublicCourses(): Observable<CoursePublicDTO[]> {
    return this.http.get<CoursePublicDTO[]>(this.COURSE_API);
  }

  getPublicCourse(id: number): Observable<CoursePublicDTO> {
    return this.http.get<CoursePublicDTO>(`${this.COURSE_API}/${id}`);
  }

  enroll(courseId: number): Observable<EnrollmentDTO> {
    return this.http.post<EnrollmentDTO>(
      `${this.ENROLL_API}/${courseId}`,
      {},
      { headers: this.authHeaders() }
    );
  }

  myEnrollments(): Observable<EnrollmentDTO[]> {
    return this.http.get<EnrollmentDTO[]>(
      `${this.ENROLL_API}/me`,
      { headers: this.authHeaders() }
    );
  }

  isEnrolled(courseId: number): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.myEnrollments().subscribe({
        next: (enrollments) => {
          const ok = enrollments?.some(e =>
            (e.course?.id === courseId) || (e.courseId === courseId)
          ) ?? false;
          observer.next(ok);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  listLessonsByCourse(courseId: number): Observable<LessonLearningDTO[]> {
    return this.http.get<LessonLearningDTO[]>(
      `${this.LESSON_LEARN_API}/by-course/${courseId}`
    );
  }

  getLesson(lessonId: number): Observable<LessonLearningDTO> {
    return this.http.get<LessonLearningDTO>(`${this.LESSON_LEARN_API}/${lessonId}`);
  }

  sortLessons(lessons: LessonLearningDTO[]): LessonLearningDTO[] {
    return [...lessons].sort((a, b) => {
      const ao = a.orderIndex ?? Number.MAX_SAFE_INTEGER;
      const bo = b.orderIndex ?? Number.MAX_SAFE_INTEGER;
      return ao - bo;
    });
  }

  lessonsById(lessons: LessonLearningDTO[]): Record<number, LessonLearningDTO> {
    const map: Record<number, LessonLearningDTO> = {};
    for (const l of lessons) map[l.id] = l;
    return map;
  }

  isDirectVideo(url?: string): boolean {
    if (!url) return false;
    return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
  }

  toYoutubeEmbed(url?: string): string | null {
    if (!url) return null;

    const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
    if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`;

    const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
    if (watch?.[1]) return `https://www.youtube.com/embed/${watch[1]}`;

    if (url.includes('youtube.com/embed/')) return url;

    return null;
  }

  getCourseProgress(courseId: number): Observable<CourseProgressDTO> {
    return this.http.get<CourseProgressDTO>(
      `${this.PROGRESS_API}/courses/${courseId}`,
      { headers: this.authHeaders() }
    );
  }

  completeLesson(courseId: number, lessonId: number): Observable<CourseProgressDTO> {
    return this.http.post<CourseProgressDTO>(
      `${this.PROGRESS_API}/courses/${courseId}/lessons/${lessonId}/complete`,
      {},
      { headers: this.authHeaders() }
    );
  }

  openLesson(courseId: number, lessonId: number): Observable<void> {
    return this.http.post<void>(
      `${this.PROGRESS_API}/courses/${courseId}/lessons/${lessonId}/open`,
      {},
      { headers: this.authHeaders() }
    );
  }

  getAdminCourses(): Observable<CourseAdminDTO[]> {
    return this.http.get<CourseAdminDTO[]>(
      this.ADMIN_COURSE_API,
      { headers: this.authHeaders() }
    );
  }

  getAdminCourse(id: number): Observable<CourseAdminDTO> {
    return this.http.get<CourseAdminDTO>(
      `${this.ADMIN_COURSE_API}/${id}`,
      { headers: this.authHeaders() }
    );
  }

  archiveCourse(id: number): Observable<CourseAdminDTO> {
    return this.http.patch<CourseAdminDTO>(
      `${this.ADMIN_COURSE_API}/${id}/archive`,
      {},
      { headers: this.authHeaders() }
    );
  }

  unarchiveCourse(id: number): Observable<CourseAdminDTO> {
    return this.http.patch<CourseAdminDTO>(
      `${this.ADMIN_COURSE_API}/${id}/unarchive`,
      {},
      { headers: this.authHeaders() }
    );
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CoursePublicDTO {
  id: number;
  title: string;
  description: string;
  instructorName: string;
  price: number;
  durationHours: number;
  createdAt: string;
}
export interface LessonLearningDTO {
  id: number;
  title: string;
  content?: string;
  videoUrl?: string;
  orderIndex?: number;
  durationMinutes?: number;
}
// ✅ Typage minimal (tu peux l’améliorer selon ton JSON exact)
export interface EnrollmentDTO {
  id: number;
  enrolledAt?: string;
  course?: { id: number };
  courseId?: number;
}

@Injectable({ providedIn: 'root' })
export class CourseApiService {
  private COURSE_API = 'http://localhost:8081/course/public/courses';
  private ENROLL_API = 'http://localhost:8081/course/public/enrollments';

  constructor(private http: HttpClient) {}

  getAllPublicCourses(): Observable<CoursePublicDTO[]> {
    return this.http.get<CoursePublicDTO[]>(this.COURSE_API);
  }

  getPublicCourse(id: number): Observable<CoursePublicDTO> {
    return this.http.get<CoursePublicDTO>(`${this.COURSE_API}/${id}`);
  }

  // -----------------------
  // ✅ ENROLLMENT
  // -----------------------
  private authHeaders(): HttpHeaders {
    // ⚠️ adapte la clé si ton token n’est pas "token"
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  enroll(courseId: number): Observable<EnrollmentDTO> {
    return this.http.post<EnrollmentDTO>(
      `${this.ENROLL_API}/${courseId}`,
      {},
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


  myEnrollments(): Observable<EnrollmentDTO[]> {
    return this.http.get<EnrollmentDTO[]>(
      `${this.ENROLL_API}/me`,
      { headers: this.authHeaders() }
    );
  }
  private LESSON_LEARN_API = 'http://localhost:8081/lesson/learn';

listLessonsByCourse(courseId: number): Observable<LessonLearningDTO[]> {
  return this.http.get<LessonLearningDTO[]>(`${this.LESSON_LEARN_API}/by-course/${courseId}`);
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
  /** Create a dictionary { [lessonId]: lesson } */
  lessonsById(lessons: LessonLearningDTO[]): Record<number, LessonLearningDTO> {
    const map: Record<number, LessonLearningDTO> = {};
    for (const l of lessons) map[l.id] = l;
    return map;
  }
  isDirectVideo(url?: string): boolean {
    if (!url) return false;
    return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
  }

  /** Convert youtube link to embed link if possible */
  toYoutubeEmbed(url?: string): string | null {
    if (!url) return null;

    // youtu.be/<id>
    const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
    if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`;

    // youtube.com/watch?v=<id>
    const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
    if (watch?.[1]) return `https://www.youtube.com/embed/${watch[1]}`;

    // already embed
    if (url.includes('youtube.com/embed/')) return url;

    return null;
  }
}
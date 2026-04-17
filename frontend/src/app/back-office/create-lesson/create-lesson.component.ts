import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

type LessonUpsertPayload = {
  courseId: number;
  title: string;
  contentText?: string | null;
  youtubeVideoId?: string | null;
  pdfRef?: string | null;
  orderIndex: number;
};

@Component({
  standalone: false,
  selector: 'app-create-lesson',
  templateUrl: './create-lesson.component.html',
  styleUrls: ['./create-lesson.component.css']
})
export class CreateLessonComponent implements OnInit {
  form!: FormGroup;
  courseId!: number;

  saving = false;
  error: string | null = null;
  success: string | null = null;

  private readonly API_URL = '/api/lesson/instructor';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));

    if (!this.courseId || Number.isNaN(this.courseId)) {
      this.error = 'Missing courseId in route.';
      return;
    }

    this.form = this.fb.group({
      courseId: [this.courseId, [Validators.required]],

      title: ['', [Validators.required, Validators.maxLength(160)]],
      contentText: [''],

      // User can paste full URL; we will extract ID before sending
      youtubeVideoId: ['', [Validators.maxLength(200)]],

      // Optional: can be empty string; we will send null
      pdfRef: ['', [Validators.maxLength(255)]],

      // REQUIRED by backend
      orderIndex: [1, [Validators.required, Validators.min(1)]]
    });
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  private extractYoutubeId(input: string): string | null {
    const s = (input || '').trim();
    if (!s) return null;

    // ID already
    if (/^[a-zA-Z0-9_-]{6,32}$/.test(s) && !s.includes('http')) return s;

    const m1 = s.match(/[?&]v=([^&]+)/);
    if (m1?.[1]) return m1[1].substring(0, 32);

    const m2 = s.match(/youtu\.be\/([^?&]+)/);
    if (m2?.[1]) return m2[1].substring(0, 32);

    const m3 = s.match(/\/embed\/([^?&]+)/);
    if (m3?.[1]) return m3[1].substring(0, 32);

    return null;
  }

  submit(): void {
    this.error = null;
    this.success = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const youtubeId = this.extractYoutubeId(String(raw.youtubeVideoId || ''));

    // If user typed something but we couldn't parse it -> block
    if (String(raw.youtubeVideoId || '').trim() && !youtubeId) {
      this.error = 'Invalid YouTube link/ID. Please provide a valid YouTube URL or just the ID.';
      return;
    }

    const pdf = String(raw.pdfRef || '').trim();

    const payload: LessonUpsertPayload = {
      courseId: Number(raw.courseId),
      title: String(raw.title || '').trim(),
      contentText: String(raw.contentText || '').trim() || null,
      youtubeVideoId: youtubeId || null,
      pdfRef: pdf ? pdf : null,
      orderIndex: Number(raw.orderIndex)
    };

    if (!payload.title) {
      this.error = 'Title is required.';
      return;
    }
    if (!payload.orderIndex || Number.isNaN(payload.orderIndex) || payload.orderIndex < 1) {
      this.error = 'Order index must be >= 1.';
      return;
    }
    // DTO limit safety
    if (payload.youtubeVideoId && payload.youtubeVideoId.length > 32) {
      this.error = 'YouTube ID is too long (max 32 characters).';
      return;
    }

    this.saving = true;

    this.http.post(this.API_URL, payload, { headers: this.authHeaders() }).subscribe({
      next: () => {
        this.saving = false;
        this.success = 'Lesson created successfully.';

        // Go back to builder
        setTimeout(() => {
          this.router.navigate(['/back-office/trainer/courses', this.courseId, 'builder']);
        }, 500);
      },
      error: (err) => {
        this.saving = false;
        const msg =
          err?.error?.message ||
          err?.error?.error ||
          (typeof err?.error === 'string' ? err.error : null) ||
          err?.message ||
          'Failed to create lesson.';
        this.error = msg;
      }
    });
  }
  resetForm(): void {
    if (!this.form) return;
  
    this.form.reset({
      courseId: this.courseId,
      title: '',
      orderIndex: 1,
      contentText: '',
      youtubeVideoId: '',
      pdfRef: ''
    });
  
    this.error = null;
    this.success = null;
  }
  cancel(): void {
    this.router.navigate(['/back-office/trainer/courses', this.courseId, 'builder']);
  }
}
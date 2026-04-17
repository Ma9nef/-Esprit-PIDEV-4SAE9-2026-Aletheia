import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

type CourseAdminDTO = {
  id: number;
  title: string;
  description: string;
  instructorName?: string | null;
  price: number;
  durationHours: number;
  imageUrl?: string | null;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type CourseUpdatePayload = {
  title: string;
  description: string;
  price: number;
  durationHours: number;
  imageUrl?: string | null;
};

@Component({
  standalone: false,
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  form!: FormGroup;
  courseId!: number;

  loading = false;
  saving = false;
  uploadingImage = false;

  error: string | null = null;
  success: string | null = null;

  // affichage image
  currentImageUrl: string | null = null;

  private readonly API_URL = '/api/instructor/courses';
  private readonly CLOUDINARY_CLOUD_NAME = 'doobtx5fl';
  private readonly CLOUDINARY_UPLOAD_PRESET = 'courses_unsigned';
  private readonly CLOUDINARY_UPLOAD_URL =
    `https://api.cloudinary.com/v1_1/${this.CLOUDINARY_CLOUD_NAME}/image/upload`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.courseId) {
      this.error = 'Missing course id in route.';
      return;
    }

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      price: [0, [Validators.required, Validators.min(0)]],
      durationHours: [1, [Validators.required, Validators.min(1), Validators.max(999)]],
      imageUrl: ['']
    });

    this.loadCourse();
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  loadCourse(): void {
    this.loading = true;
    this.error = null;

    this.http.get<CourseAdminDTO>(`${this.API_URL}/${this.courseId}`, { headers: this.authHeaders() })
      .subscribe({
        next: (c) => {
          this.loading = false;

          this.currentImageUrl = c.imageUrl ?? null;

          this.form.patchValue({
            title: c.title ?? '',
            description: c.description ?? '',
            price: c.price ?? 0,
            durationHours: c.durationHours ?? 1,
            imageUrl: c.imageUrl ?? ''
          }, { emitEvent: false });
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || err?.message || 'Failed to load course.';
        }
      });
  }

  submit(): void {
    this.error = null;
    this.success = null;

    if (this.uploadingImage) {
      this.error = 'Please wait until the image upload finishes.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    const raw = this.form.getRawValue();
    const payload: CourseUpdatePayload = {
      title: String(raw.title || '').trim(),
      description: String(raw.description || '').trim(),
      price: Math.max(0, Number(raw.price ?? 0)),
      durationHours: Math.max(1, Number(raw.durationHours ?? 1)),
      imageUrl: raw.imageUrl ? String(raw.imageUrl).trim() : null
    };

    this.http.put<CourseAdminDTO>(`${this.API_URL}/${this.courseId}`, payload, { headers: this.authHeaders() })
      .subscribe({
        next: (updated) => {
          this.saving = false;
          this.success = 'Course updated successfully.';
          this.currentImageUrl = updated?.imageUrl ?? payload.imageUrl ?? this.currentImageUrl;

          setTimeout(() => this.router.navigate(['/back-office/trainer/manage-courses']), 500);
        },
        error: (err) => {
          this.saving = false;
          this.error = err?.error?.message || err?.message || 'Failed to update course.';
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/back-office/trainer/manage-courses']);
  }

  removeImage(): void {
    this.currentImageUrl = null;
    this.form.patchValue({ imageUrl: '' }, { emitEvent: false });
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/course-placeholder.jpg';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.error = 'Please select a valid image file.';
      input.value = '';
      return;
    }

    this.uploadingImage = true;
    this.error = null;
    this.success = null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'courses');

    this.http.post<any>(this.CLOUDINARY_UPLOAD_URL, formData).subscribe({
      next: (res) => {
        const uploadedUrl = res?.secure_url || res?.url || null;
        if (!uploadedUrl) {
          this.error = 'Upload succeeded but no image URL was returned.';
          this.uploadingImage = false;
          return;
        }

        this.form.patchValue({ imageUrl: uploadedUrl }, { emitEvent: false });
        this.currentImageUrl = uploadedUrl;
        this.uploadingImage = false;
        this.success = 'Image uploaded successfully.';
      },
      error: (err) => {
        this.uploadingImage = false;
        this.error = err?.error?.error?.message || err?.error?.message || 'Image upload failed.';
      }
    });
  }
}
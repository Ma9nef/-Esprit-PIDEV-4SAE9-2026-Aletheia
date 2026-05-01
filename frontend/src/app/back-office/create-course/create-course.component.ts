import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

type CourseCreatePayload = {
  title: string;
  description: string;
  price: number;
  durationHours: number;
  category: string;
  subCategory: string;
  imageUrl?: string | null;
};

type CourseCreatedResponse = {
  id: number;
};

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css']
})
export class CreateCourseComponent implements OnInit {
  form!: FormGroup;

  saving = false;
  uploadingImage = false;

  error: string | null = null;
  success: string | null = null;

  imagePreview: string | null = null;

  /** Uses Angular proxy */
  private readonly API_URL = '/api/instructor/courses';

  /** Cloudinary (Unsigned Upload) */
  private readonly CLOUDINARY_CLOUD_NAME = 'doobtx5fl';
  private readonly CLOUDINARY_UPLOAD_PRESET = 'courses_unsigned';
  private readonly CLOUDINARY_UPLOAD_URL =
    `https://api.cloudinary.com/v1_1/${this.CLOUDINARY_CLOUD_NAME}/image/upload`;

  /**
   * Catalogue (simple). Remplace-le par un API plus tard si tu veux.
   * category -> subCategories[]
   */
  readonly categoryCatalog: Record<string, string[]> = {
    Development: ['Python', 'Java', 'Spring Boot', 'Node.js', 'C#', 'C++'],
    'Web Development': ['Angular', 'React', 'Vue', 'Symfony', 'Laravel'],
    'Mobile Development': ['Flutter', 'Android', 'iOS', 'React Native'],
    'Data & AI': ['Data Analysis', 'Machine Learning', 'Deep Learning']
  };

  subCategories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      price: [0, [Validators.required, Validators.min(0)]],
      durationHours: [1, [Validators.required, Validators.min(1), Validators.max(999)]],

      // ✅ NEW
      category: ['', [Validators.required, Validators.maxLength(120)]],
      subCategory: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(120)]],

      imageUrl: ['']
    });

    // auto-update subCategory choices when category changes
    this.form.get('category')?.valueChanges.subscribe(() => this.onCategoryChange());
  }

  onCategoryChange(): void {
    const cat = String(this.form.get('category')?.value || '').trim();
    this.subCategories = this.categoryCatalog[cat] ?? [];

    const subCtrl = this.form.get('subCategory');
    if (!subCtrl) return;

    subCtrl.reset('', { emitEvent: false });

    if (this.subCategories.length) {
      subCtrl.enable({ emitEvent: false });
    } else {
      subCtrl.disable({ emitEvent: false });
    }
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
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

    // getRawValue() pour inclure subCategory même si disabled parfois
    const raw = this.form.getRawValue();

    const payload: CourseCreatePayload = {
      title: String(raw.title || '').trim(),
      description: String(raw.description || '').trim(),
      price: Math.max(0, Number(raw.price ?? 0)),
      durationHours: Math.max(1, Number(raw.durationHours ?? 1)),

      // ✅ NEW
      category: String(raw.category || '').trim(),
      subCategory: String(raw.subCategory || '').trim(),

      imageUrl: raw.imageUrl ? String(raw.imageUrl).trim() : null
    };

    this.http
      .post<CourseCreatedResponse>(this.API_URL, payload, { headers: this.authHeaders() })
      .subscribe({
        next: (created) => {
          this.saving = false;
          this.success = 'Course created successfully. Redirecting to lesson creation...';

          const courseId = created?.id;

          if (!courseId || Number.isNaN(Number(courseId))) {
            this.error = 'Course created but no ID was returned by the server.';
            return;
          }

          setTimeout(() => {
            this.router.navigate([
              '/back-office/trainer/courses',
              courseId,
              'lessons',
              'create'
            ]);
          }, 600);
        },
        error: (err) => {
          this.saving = false;
          const msg =
            err?.error?.message ||
            err?.error?.error ||
            (typeof err?.error === 'string' ? err.error : null) ||
            err?.message ||
            'Failed to create course.';
          this.error = msg;
        }
      });
  }

  resetForm(): void {
    this.form.reset({
      title: '',
      description: '',
      price: 0,
      durationHours: 1,
      category: '',
      subCategory: '',
      imageUrl: ''
    });

    this.subCategories = [];
    this.form.get('subCategory')?.disable({ emitEvent: false });

    this.imagePreview = null;
    this.error = null;
    this.success = null;
  }

  removeImage(): void {
    this.imagePreview = null;
    this.form.patchValue({ imageUrl: '' }, { emitEvent: false });
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

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = typeof reader.result === 'string' ? reader.result : null;
    };
    reader.readAsDataURL(file);

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
        this.uploadingImage = false;
        this.success = 'Image uploaded successfully.';
      },
      error: (err) => {
        this.uploadingImage = false;
        this.error =
          err?.error?.error?.message ||
          err?.error?.message ||
          'Image upload failed.';
      }
    });
  }
}
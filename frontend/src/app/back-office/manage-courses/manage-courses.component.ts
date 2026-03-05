import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InstructorCourseApiService, CourseAdminDTO } from './instructor-course-api.service';

@Component({
  selector: 'app-manage-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-courses.component.html',
  styleUrls: ['./manage-courses.component.css'],
})
export class ManageCoursesComponent implements OnInit {
  loading = false;
  error: string | null = null;

  courses: CourseAdminDTO[] = [];

  editingId: number | null = null;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [0, [Validators.required, Validators.min(0)]],
    durationHours: [1, [Validators.required, Validators.min(1)]],
  });

  constructor(
    private fb: FormBuilder,
    private api: InstructorCourseApiService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;

    this.api.listMine().subscribe({
      next: (data) => {
        this.courses = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = this.extractError(err) || 'Impossible de charger vos cours.';
      },
    });
  }

  startCreate() {
    this.editingId = null;
    this.form.reset({
      title: '',
      description: '',
      price: 0,
      durationHours: 1,
    });
  }

  startEdit(c: CourseAdminDTO) {
    this.editingId = c.id;
    this.form.setValue({
      title: c.title ?? '',
      description: c.description ?? '',
      price: c.price ?? 0,
      durationHours: c.durationHours ?? 1,
    });
  }

  cancelEdit() {
    this.startCreate();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const dto = this.form.getRawValue() as any;

    const req$ = this.editingId
      ? this.api.update(this.editingId, dto)
      : this.api.create(dto);

    req$.subscribe({
      next: () => {
        this.loading = false;
        this.startCreate();
        this.load();
      },
      error: (err) => {
        this.loading = false;
        this.error = this.extractError(err) || 'Échec de sauvegarde.';
      },
    });
  }

  remove(id: number) {
    const ok = confirm('Supprimer ce cours ?');
    if (!ok) return;

    this.loading = true;
    this.error = null;

    this.api.delete(id).subscribe({
      next: () => {
        this.loading = false;
        this.load();
      },
      error: (err) => {
        this.loading = false;
        this.error = this.extractError(err) || 'Échec de suppression.';
      },
    });
  }

  private extractError(err: any): string | null {
    // Gestion simple (Spring renvoie parfois message / error / etc.)
    return err?.error?.message || err?.error?.error || err?.message || null;
  }
}
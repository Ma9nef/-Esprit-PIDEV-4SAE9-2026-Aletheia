import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';

import { finalize } from 'rxjs/operators';

import { CourseApiService } from 'src/app/core/services/course-api.service';

import {
  InstructorCourseApiService,
  CourseAdminDTO,
  CourseCreateDTO,
  CourseUpdateDTO
} from './instructor-course-api.service';

type SortKey = 'updatedAt' | 'createdAt' | 'title' | 'price' | 'durationHours';
type SortDir = 'asc' | 'desc';

type CourseFormValue = {
  title: string;
  description: string;
  price: number;
  durationHours: number;
};

@Component({
  selector: 'app-manage-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './manage-courses.component.html',
  styleUrls: ['./manage-courses.component.css']
})
export class ManageCoursesComponent implements OnInit {

  listLoading = false;
  saving = false;

  error: string | null = null;
  success: string | null = null;

  courses: CourseAdminDTO[] = [];
  deletingIds = new Set<number>();

  editingId: number | null = null;

  q = '';
  sortKey: SortKey = 'updatedAt';
  sortDir: SortDir = 'desc';

  form: FormGroup;

  isAdmin = false;

  constructor(
    private fb: FormBuilder,
    private api: InstructorCourseApiService,
    private courseApi: CourseApiService,
    private router: Router // ✅ FIX: inject Router
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      price: [0, [Validators.required, Validators.min(0)]],
      durationHours: [1, [Validators.required, Validators.min(1), Validators.max(999)]],
    });
  }

  ngOnInit(): void {

    const role = localStorage.getItem('role');
    this.isAdmin = role === 'ADMIN';

    if (!this.isAdmin) {
      this.startCreate();
    }

    this.load();
  }

  get filteredSortedCourses(): CourseAdminDTO[] {

    const q = (this.q || '').trim().toLowerCase();

    const filtered = !q ? this.courses : this.courses.filter(c =>
      (c.title || '').toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q)
    );

    const dir = this.sortDir === 'asc' ? 1 : -1;

    const toTime = (v?: string) => (v ? new Date(v).getTime() : 0);

    return [...filtered].sort((a, b) => {
      switch (this.sortKey) {

        case 'title':
          return dir * (String(a.title ?? '').localeCompare(String(b.title ?? ''), undefined, { sensitivity: 'base' }));

        case 'price':
          return dir * ((a.price ?? 0) - (b.price ?? 0));

        case 'durationHours':
          return dir * ((a.durationHours ?? 0) - (b.durationHours ?? 0));

        case 'createdAt':
          return dir * (toTime(a.createdAt) - (toTime(b.createdAt)));

        case 'updatedAt':
        default:
          return dir * (toTime(a.updatedAt) - (toTime(b.updatedAt)));
      }
    });
  }

  load(): void {

    this.listLoading = true;
    this.error = null;

    if (this.isAdmin) {

      this.courseApi.getAdminCourses()
        .pipe(finalize(() => this.listLoading = false))
        .subscribe({
          next: (data) => this.courses = data ?? [],
          error: () => this.error = 'Failed to load courses'
        });

    } else {

      this.api.listMine()
        .pipe(finalize(() => this.listLoading = false))
        .subscribe({
          next: (data) => this.courses = data ?? [],
          error: (err) => {
            this.error = this.extractError(err) || 'Impossible de charger vos cours.';
          }
        });

    }

  }

  startCreate(): void {

    this.editingId = null;
    this.success = null;
    this.error = null;

    this.form.reset({
      title: '',
      description: '',
      price: 0,
      durationHours: 1
    });

  }

  startEdit(c: CourseAdminDTO): void {

    this.editingId = c.id;

    this.form.setValue({
      title: c.title ?? '',
      description: c.description ?? '',
      price: Number(c.price ?? 0),
      durationHours: Number(c.durationHours ?? 1)
    });

  }

  cancelEdit(): void {
    this.startCreate();
  }

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.saving) return;

    this.saving = true;

    const raw = this.form.getRawValue() as CourseFormValue;

    const payload: CourseCreateDTO = {
      title: raw.title.trim(),
      description: raw.description.trim(),
      price: Number(raw.price),
      durationHours: Number(raw.durationHours)
    };

    const req$ = this.editingId
      ? this.api.update(this.editingId, payload as CourseUpdateDTO)
      : this.api.create(payload);

    req$
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: () => {
          this.success = this.editingId ? 'Cours mis à jour.' : 'Cours créé.';
          this.startCreate();
          this.load();
        },
        error: (err) => {
          this.error = this.extractError(err) || 'Échec de sauvegarde.';
        }
      });

  }

  remove(course: CourseAdminDTO): void {

    const id = course.id;

    if (!confirm(`Supprimer le cours "${course.title}" ?`)) return;

    this.api.delete(id).subscribe(() => {
      this.courses = this.courses.filter(c => c.id !== id);
    });

  }

  archive(course: CourseAdminDTO): void {
    this.courseApi.archiveCourse(course.id).subscribe(() => {
      course.archived = true;
    });
  }

  unarchive(course: CourseAdminDTO): void {
    this.courseApi.unarchiveCourse(course.id).subscribe(() => {
      course.archived = false;
    });
  }

  private extractError(err: any): string | null {
    return (
      err?.error?.message ||
      err?.error?.error ||
      err?.error?.detail ||
      err?.message ||
      null
    );
  }

  isDeleting(id: number): boolean {
    return this.deletingIds.has(id);
  }

  trackById(index: number, course: CourseAdminDTO): number {
    return course.id;
  }

  toggleSort(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
  }

  goCreateCourse(): void {
    this.router.navigate(['/back-office/trainer/create-course']);
  }
}
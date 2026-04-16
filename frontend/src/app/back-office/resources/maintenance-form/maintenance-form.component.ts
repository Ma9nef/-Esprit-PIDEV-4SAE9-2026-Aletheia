import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceManagementService } from '../resource-management.service';
import { Resource } from '../resource-management.model';

@Component({
  standalone: false,
  selector: 'app-maintenance-form',
  templateUrl: './maintenance-form.component.html',
  styleUrls: ['./maintenance-form.component.css']
})
export class MaintenanceFormComponent implements OnInit {
  form!: FormGroup;
  resource: Resource | null = null;
  resourceId = '';
  loading = false;
  saving = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private svc: ResourceManagementService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      notes: ['']
    });

    this.resourceId = this.route.snapshot.paramMap.get('id') || '';
    if (this.resourceId) {
      this.loadResource();
    }
  }

  loadResource(): void {
    this.loading = true;
    this.svc.getResource(this.resourceId).subscribe({
      next: (r) => { this.resource = r; this.loading = false; },
      error: () => { this.error = 'Failed to load resource.'; this.loading = false; }
    });
  }

  private toIsoDateTime(value: string): string {
    if (!value) return value;
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? `${value}:00` : value;
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.saving = true;
    this.error = '';

    const payload = {
      resourceId: this.resourceId,
      title: this.form.value.title.trim(),
      startTime: this.toIsoDateTime(this.form.value.startTime),
      endTime: this.toIsoDateTime(this.form.value.endTime),
      ...(this.form.value.notes?.trim() ? { notes: this.form.value.notes.trim() } : {})
    };

    this.svc.createMaintenanceWindow(payload).subscribe({
      next: () => {
        this.router.navigate(['/back-office/admin/resources', this.resourceId, 'maintenance']);
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to schedule maintenance. Please try again.';
        this.saving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/back-office/admin/resources', this.resourceId, 'maintenance']);
  }

  get f() { return this.form.controls; }
}

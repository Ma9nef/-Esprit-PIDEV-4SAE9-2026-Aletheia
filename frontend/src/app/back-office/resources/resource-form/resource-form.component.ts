import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceManagementService } from '../resource-management.service';
import { ResourceType } from '../resource-management.model';

@Component({
  selector: 'app-resource-form',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.css']
})
export class ResourceFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  resourceId = '';
  loading = false;
  saving = false;
  error = '';
  metadataError = '';

  readonly types: ResourceType[] = ['ROOM', 'DEVICE', 'MATERIAL'];

  constructor(
    private fb: FormBuilder,
    private svc: ResourceManagementService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['ROOM', Validators.required],
      capacity: [null],
      metadataRaw: ['']
    });

    this.resourceId = this.route.snapshot.paramMap.get('id') || '';
    if (this.resourceId) {
      this.isEdit = true;
      this.loadResource();
    }
  }

  loadResource(): void {
    this.loading = true;
    this.svc.getResource(this.resourceId).subscribe({
      next: (r) => {
        let metaRaw = '';
        if (r.metadataJson) {
          try { metaRaw = JSON.stringify(JSON.parse(r.metadataJson), null, 2); } catch { metaRaw = r.metadataJson; }
        }
        this.form.patchValue({
          name: r.name,
          type: r.type,
          capacity: r.capacity,
          metadataRaw: metaRaw
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load resource.';
        this.loading = false;
      }
    });
  }

  validateMetadata(): Record<string, any> | null {
    const raw = this.form.value.metadataRaw?.trim();
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      this.metadataError = 'Invalid JSON in metadata field.';
      return undefined as any;
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.metadataError = '';

    const metadata = this.validateMetadata();
    if (this.metadataError) return;

    const payload = {
      name: this.form.value.name.trim(),
      type: this.form.value.type as ResourceType,
      capacity: this.form.value.capacity ? Number(this.form.value.capacity) : null,
      ...(metadata ? { metadata } : {})
    };

    this.saving = true;
    const req = this.isEdit
      ? this.svc.updateResource(this.resourceId, payload)
      : this.svc.createResource(payload);

    req.subscribe({
      next: () => this.router.navigate(['/back-office/admin/resources']),
      error: () => {
        this.error = 'Failed to save resource. Please try again.';
        this.saving = false;
      }
    });
  }

  cancel(): void { this.router.navigate(['/back-office/admin/resources']); }

  typeLabel(type: ResourceType): string {
    const map: Record<ResourceType, string> = { ROOM: 'Room', DEVICE: 'Device', MATERIAL: 'Material' };
    return map[type];
  }

  get f() { return this.form.controls; }
}

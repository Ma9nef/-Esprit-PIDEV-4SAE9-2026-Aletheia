import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceManagementService } from '../resource-management.service';
import { ResourceType } from '../resource-management.model';

@Component({
  standalone: false,
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
  attributesError = '';
  metadataError = '';

  readonly types: ResourceType[] = [
    'CLASSROOM', 'COMPUTER_LAB', 'AMPHITHEATER', 'PROJECTOR', 'LAPTOP', 'SMARTBOARD', 'CUSTOM_EQUIPMENT'
  ];

  constructor(
    private fb: FormBuilder,
    private svc: ResourceManagementService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['CLASSROOM', Validators.required],
      capacity: [null],
      description: [''],
      location: [''],
      requiresApproval: [false],
      conditionScore: [5, [Validators.min(1), Validators.max(5)]],
      maxReservationHours: [null],
      minAdvanceBookingHours: [null],
      maxAdvanceBookingDays: [null],
      concurrentCapacity: [null],
      tagsRaw: [''],
      attributesRaw: [''],
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
        let attrsRaw = '';
        if (r.attributes) {
          try { attrsRaw = JSON.stringify(r.attributes, null, 2); } catch { attrsRaw = ''; }
        }
        this.form.patchValue({
          name: r.name,
          type: r.type,
          capacity: r.capacity,
          description: r.description || '',
          location: r.location || '',
          requiresApproval: r.requiresApproval,
          conditionScore: r.conditionScore,
          maxReservationHours: r.maxReservationHours || null,
          minAdvanceBookingHours: r.minAdvanceBookingHours || null,
          attributesRaw: attrsRaw
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load resource.';
        this.loading = false;
      }
    });
  }

  validateAttributes(): Record<string, any> | null {
    const raw = this.form.value.attributesRaw?.trim();
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      this.attributesError = 'Invalid JSON in attributes field.';
      return undefined as any;
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.attributesError = '';

    const attributes = this.validateAttributes();
    if (this.attributesError) return;

    const payload: any = {
      name: this.form.value.name.trim(),
      type: this.form.value.type as ResourceType,
      capacity: this.form.value.capacity ? Number(this.form.value.capacity) : null,
      requiresApproval: this.form.value.requiresApproval,
      conditionScore: Number(this.form.value.conditionScore),
      ...(this.form.value.description?.trim() ? { description: this.form.value.description.trim() } : {}),
      ...(this.form.value.location?.trim() ? { location: this.form.value.location.trim() } : {}),
      ...(this.form.value.maxReservationHours !== null && this.form.value.maxReservationHours !== ''
        ? { maxReservationHours: Number(this.form.value.maxReservationHours) } : {}),
      ...(this.form.value.minAdvanceBookingHours !== null && this.form.value.minAdvanceBookingHours !== ''
        ? { minAdvanceBookingHours: Number(this.form.value.minAdvanceBookingHours) } : {}),
      ...(attributes ? { attributes } : {})
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

  typeIcon(type: ResourceType): string {
    const map: Record<ResourceType, string> = {
      CLASSROOM: '🏫', COMPUTER_LAB: '🖥️', AMPHITHEATER: '🎭',
      PROJECTOR: '📽️', LAPTOP: '💻', SMARTBOARD: '📋', CUSTOM_EQUIPMENT: '🔧'
    };
    return map[type] ?? '📦';
  }

  typeLabel(type: ResourceType): string {
    const map: Record<ResourceType, string> = {
      CLASSROOM: 'Classroom',
      COMPUTER_LAB: 'Computer Lab',
      AMPHITHEATER: 'Amphitheater',
      PROJECTOR: 'Projector',
      LAPTOP: 'Laptop',
      SMARTBOARD: 'Smartboard',
      CUSTOM_EQUIPMENT: 'Custom Equipment'
    };
    return map[type] ?? type;
  }

  get f() { return this.form.controls; }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SubscriptionNotificationService } from '../../core/services/subscription-notification.service';
import { ResourceManagementService } from '../resources/resource-management.service';
import { Resource, ResourceType } from '../resources/resource-management.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  showDashboardContent = true;
  showDashboardWidgets = true;
  adminUnreadNotificationCount = 0;

  // ── Resource management state ──────────────────────────────────────────────
  resources: Resource[] = [];
  resourcesLoading = false;
  resourcesError = '';
  resourceSearchTerm = '';
  resourceFilterType: ResourceType | 'ALL' = 'ALL';
  showResourceDeleteModal = false;
  pendingDeleteResourceId = '';
  showResourceForm = false;
  editingResource: Resource | null = null;
  resourceFormName = '';
  resourceFormType: ResourceType = 'ROOM';
  resourceFormCapacity: number | null = null;
  resourceFormSaving = false;
  resourceFormError = '';
  readonly resourceTypes: Array<ResourceType | 'ALL'> = ['ALL', 'ROOM', 'DEVICE', 'MATERIAL'];
  readonly resourceTypeOptions: ResourceType[] = ['ROOM', 'DEVICE', 'MATERIAL'];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: SubscriptionNotificationService,
    private resourceSvc: ResourceManagementService
  ) {}

  ngOnInit(): void {
    // Listen for child route changes
    this.activatedRoute.firstChild?.url.subscribe(() => {
      // If there's a child route active (like manage-library or manage-users), hide dashboard content
      this.showDashboardContent = !this.activatedRoute.firstChild;
    });
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showDashboardContent = !this.activatedRoute.firstChild;
        if (this.showDashboardContent) this.loadResources();
      });
    this.loadResources();
  }

  markAdminNotificationsAsRead(): void {
    this.notificationService.markAllAdminNotificationsAsRead().subscribe({
      next: () => {
        this.adminUnreadNotificationCount = 0;
      }
    });
  }

  private loadAdminUnreadCount(): void {
    this.notificationService.getAdminUnreadCount().subscribe({
      next: (response) => {
        this.adminUnreadNotificationCount = response.unreadCount ?? 0;
      },
      error: () => {
        this.adminUnreadNotificationCount = 0;
      }
    });
  }

  private updateDashboardVisibility(): void {
    this.showDashboardContent = !this.activatedRoute.firstChild;
  }

  // ── Load ───────────────────────────────────────────────────────────────────
  loadResources(): void {
    this.resourcesLoading = true;
    this.resourcesError = '';
    this.resourceSvc.getResources().subscribe({
      next: (data) => { this.resources = data; this.resourcesLoading = false; },
      error: () => { this.resourcesError = 'Could not reach ResourceManagement service (port 8094).'; this.resourcesLoading = false; }
    });
  }

  // ── Filtering ──────────────────────────────────────────────────────────────
  get filteredResources(): Resource[] {
    return this.resources.filter(r => {
      const matchType = this.resourceFilterType === 'ALL' || r.type === this.resourceFilterType;
      const matchName = !this.resourceSearchTerm || r.name.toLowerCase().includes(this.resourceSearchTerm.toLowerCase());
      return matchType && matchName;
    });
  }

  countByType(type: ResourceType): number {
    return this.resources.filter(r => r.type === type).length;
  }

  // ── Inline form ────────────────────────────────────────────────────────────
  openCreateForm(): void {
    this.editingResource = null;
    this.resourceFormName = '';
    this.resourceFormType = 'ROOM';
    this.resourceFormCapacity = null;
    this.resourceFormError = '';
    this.showResourceForm = true;
  }

  openEditForm(r: Resource): void {
    this.editingResource = r;
    this.resourceFormName = r.name;
    this.resourceFormType = r.type;
    this.resourceFormCapacity = r.capacity;
    this.resourceFormError = '';
    this.showResourceForm = true;
  }

  closeForm(): void { this.showResourceForm = false; this.editingResource = null; }

  saveResource(): void {
    if (!this.resourceFormName.trim()) { this.resourceFormError = 'Name is required.'; return; }
    this.resourceFormSaving = true;
    this.resourceFormError = '';
    const payload = {
      name: this.resourceFormName.trim(),
      type: this.resourceFormType,
      capacity: this.resourceFormCapacity ?? null
    };
    const req = this.editingResource
      ? this.resourceSvc.updateResource(this.editingResource.id, payload)
      : this.resourceSvc.createResource(payload);

    req.subscribe({
      next: () => { this.closeForm(); this.loadResources(); this.resourceFormSaving = false; },
      error: () => { this.resourceFormError = 'Failed to save. Please try again.'; this.resourceFormSaving = false; }
    });
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  confirmDeleteResource(id: string): void { this.pendingDeleteResourceId = id; this.showResourceDeleteModal = true; }
  cancelDeleteResource(): void { this.pendingDeleteResourceId = ''; this.showResourceDeleteModal = false; }

  deleteResource(): void {
    this.resourceSvc.deleteResource(this.pendingDeleteResourceId).subscribe({
      next: () => { this.resources = this.resources.filter(r => r.id !== this.pendingDeleteResourceId); this.cancelDeleteResource(); },
      error: () => { this.cancelDeleteResource(); }
    });
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  viewReservations(id: string): void {
    this.router.navigate(['/back-office/admin/resources', id, 'reservations']);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  typeLabel(type: ResourceType): string {
    return { ROOM: 'Room', DEVICE: 'Device', MATERIAL: 'Material' }[type];
  }

  typeIcon(type: ResourceType): string {
    return { ROOM: '🏫', DEVICE: '💻', MATERIAL: '📦' }[type];
  }

  typeBadgeClass(type: ResourceType): string {
    return { ROOM: 'res-badge-room', DEVICE: 'res-badge-device', MATERIAL: 'res-badge-material' }[type];
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceManagementService } from '../resource-management.service';
import { Resource, ResourceType } from '../resource-management.model';

@Component({
  selector: 'app-manage-resources',
  templateUrl: './manage-resources.component.html',
  styleUrls: ['./manage-resources.component.css']
})
export class ManageResourcesComponent implements OnInit {
  resources: Resource[] = [];
  filtered: Resource[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedType: ResourceType | 'ALL' = 'ALL';
  showDeleteModal = false;
  pendingDeleteId = '';

  readonly types: Array<ResourceType | 'ALL'> = ['ALL', 'ROOM', 'DEVICE', 'MATERIAL'];

  constructor(private svc: ResourceManagementService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.svc.getResources().subscribe({
      next: (data) => {
        this.resources = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load resources. Make sure the ResourceManagement service is running on port 8086.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.resources];
    if (this.selectedType !== 'ALL') {
      result = result.filter(r => r.type === this.selectedType);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(term));
    }
    this.filtered = result;
  }

  onSearch(): void { this.applyFilters(); }
  onTypeChange(): void { this.applyFilters(); }
  resetFilters(): void { this.searchTerm = ''; this.selectedType = 'ALL'; this.applyFilters(); }

  navigateToCreate(): void { this.router.navigate(['/back-office/admin/resources/new']); }
  navigateToEdit(id: string): void { this.router.navigate(['/back-office/admin/resources/edit', id]); }
  viewReservations(id: string): void { this.router.navigate(['/back-office/admin/resources', id, 'reservations']); }

  confirmDelete(id: string): void { this.pendingDeleteId = id; this.showDeleteModal = true; }
  cancelDelete(): void { this.pendingDeleteId = ''; this.showDeleteModal = false; }

  deleteResource(): void {
    this.svc.deleteResource(this.pendingDeleteId).subscribe({
      next: () => {
        this.resources = this.resources.filter(r => r.id !== this.pendingDeleteId);
        this.applyFilters();
        this.cancelDelete();
      },
      error: () => {
        this.error = 'Failed to delete resource.';
        this.cancelDelete();
      }
    });
  }

  typeLabel(type: ResourceType): string {
    const map: Record<ResourceType, string> = { ROOM: 'Room', DEVICE: 'Device', MATERIAL: 'Material' };
    return map[type];
  }

  typeIcon(type: ResourceType): string {
    const map: Record<ResourceType, string> = { ROOM: '🏫', DEVICE: '💻', MATERIAL: '📦' };
    return map[type];
  }

  typeBadgeClass(type: ResourceType): string {
    const map: Record<ResourceType, string> = {
      ROOM: 'badge-room',
      DEVICE: 'badge-device',
      MATERIAL: 'badge-material'
    };
    return map[type];
  }

  countByType(type: ResourceType): number {
    return this.resources.filter(r => r.type === type).length;
  }
}

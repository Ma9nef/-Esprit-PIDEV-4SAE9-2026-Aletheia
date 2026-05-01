import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ResourceManagementService } from '../resources/resource-management.service';
import { CreateResourceRequest, Resource, ResourceType, RoomMapLocation, UpdateResourceRequest } from '../resources/resource-management.model';

@Component({
  standalone: false,
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  showDashboardContent = true;
  showDashboardWidgets = true;

  // ── Resource management state ──────────────────────────────────────────────
  resources: Resource[] = [];
  resourcesLoading = false;
  resourcesError = '';
  resourceSearchTerm = '';
  resourceFilterType: ResourceType | 'ALL' = 'ALL';
  resourceSort: 'NAME_ASC' | 'NAME_DESC' | 'CAPACITY_DESC' | 'CAPACITY_ASC' = 'NAME_ASC';
  showResourceDeleteModal = false;
  pendingDeleteResourceId = '';
  showResourceForm = false;
  editingResource: Resource | null = null;
  resourceFormName = '';
  resourceFormType: ResourceType = 'CLASSROOM';
  resourceFormCapacity: number | null = null;
  resourceFormSaving = false;
  resourceFormError = '';
  readonly defaultRoomMapLat = 36.8065;
  readonly defaultRoomMapLng = 10.1815;
  roomMapCenterLat = this.defaultRoomMapLat;
  roomMapCenterLng = this.defaultRoomMapLng;
  roomMapZoom = 15;
  roomMapLat: number | null = null;
  roomMapLng: number | null = null;
  readonly resourceTypes: Array<ResourceType | 'ALL'> = [
    'ALL', 'CLASSROOM', 'COMPUTER_LAB', 'AMPHITHEATER', 'PROJECTOR', 'LAPTOP', 'SMARTBOARD', 'CUSTOM_EQUIPMENT'
  ];
  readonly resourceTypeOptions: ResourceType[] = [
    'CLASSROOM', 'COMPUTER_LAB', 'AMPHITHEATER', 'PROJECTOR', 'LAPTOP', 'SMARTBOARD', 'CUSTOM_EQUIPMENT'
  ];
  /** Room types are those with a physical location (map pin makes sense). */
  readonly roomResourceTypes: ResourceType[] = ['CLASSROOM', 'COMPUTER_LAB', 'AMPHITHEATER'];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
    const filtered = this.resources.filter(r => {
      const matchType = this.resourceFilterType === 'ALL' || r.type === this.resourceFilterType;
      const matchName = !this.resourceSearchTerm || r.name.toLowerCase().includes(this.resourceSearchTerm.toLowerCase());
      return matchType && matchName;
    });

    return [...filtered].sort((a, b) => {
      switch (this.resourceSort) {
        case 'NAME_DESC':
          return b.name.localeCompare(a.name);
        case 'CAPACITY_ASC':
          return (a.capacity ?? Number.MAX_SAFE_INTEGER) - (b.capacity ?? Number.MAX_SAFE_INTEGER);
        case 'CAPACITY_DESC':
          return (b.capacity ?? -1) - (a.capacity ?? -1);
        case 'NAME_ASC':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }

  countByType(type: ResourceType): number {
    return this.resources.filter(r => r.type === type).length;
  }

  get roomCount(): number {
    return this.resources.filter(r => r.type === 'CLASSROOM' || r.type === 'COMPUTER_LAB' || r.type === 'AMPHITHEATER').length;
  }

  get deviceCount(): number {
    return this.resources.filter(r => r.type === 'PROJECTOR' || r.type === 'LAPTOP' || r.type === 'SMARTBOARD').length;
  }

  get equipmentCount(): number {
    return this.resources.filter(r => r.type === 'CUSTOM_EQUIPMENT').length;
  }

  get hasActiveResourceFilters(): boolean {
    return !!this.resourceSearchTerm.trim() || this.resourceFilterType !== 'ALL' || this.resourceSort !== 'NAME_ASC';
  }

  clearResourceFilters(): void {
    this.resourceSearchTerm = '';
    this.resourceFilterType = 'ALL';
    this.resourceSort = 'NAME_ASC';
  }

  capacityLabel(resource: Resource): string {
    if (resource.capacity === null || resource.capacity === undefined) {
      return 'Not set';
    }
    return `${resource.capacity} seats`;
  }

  // ── Inline form ────────────────────────────────────────────────────────────
  openCreateForm(): void {
    this.editingResource = null;
    this.resourceFormName = '';
    this.resourceFormType = 'CLASSROOM';
    this.resourceFormCapacity = null;
    this.resourceFormError = '';
    this.initializeRoomMap(null);
    this.showResourceForm = true;
  }

  openEditForm(r: Resource): void {
    this.editingResource = r;
    this.resourceFormName = r.name;
    this.resourceFormType = r.type;
    this.resourceFormCapacity = r.capacity;
    this.resourceFormError = '';
    this.initializeRoomMap(r);
    this.showResourceForm = true;
  }

  closeForm(): void { this.showResourceForm = false; this.editingResource = null; }

  saveResource(): void {
    if (!this.resourceFormName.trim()) { this.resourceFormError = 'Name is required.'; return; }
    if (this.isRoomResourceForm && (this.roomMapLat === null || this.roomMapLng === null)) {
      this.resourceFormError = 'For room resources, please pin the location on the map.';
      return;
    }
    this.resourceFormSaving = true;
    this.resourceFormError = '';
    const basePayload = {
      name: this.resourceFormName.trim(),
      type: this.resourceFormType,
      capacity: this.resourceFormCapacity ?? null,
      location: this.buildResourceLocation()
    };
    const attributes = this.buildResourceAttributes();

    const createPayload: CreateResourceRequest = {
      ...basePayload,
      ...(attributes ? { attributes } : {})
    };
    const updatePayload: UpdateResourceRequest = {
      ...basePayload,
      ...(attributes ? { attributes } : {})
    };

    const req = this.editingResource
      ? this.resourceSvc.updateResource(this.editingResource.id, updatePayload)
      : this.resourceSvc.createResource(createPayload);

    req.subscribe({
      next: () => { this.closeForm(); this.loadResources(); this.resourceFormSaving = false; },
      error: () => { this.resourceFormError = 'Failed to save. Please try again.'; this.resourceFormSaving = false; }
    });
  }

  get isRoomResourceForm(): boolean {
    return this.roomResourceTypes.includes(this.resourceFormType);
  }

  get roomMapImageUrl(): string {
    const centerLat = this.roomMapCenterLat.toFixed(6);
    const centerLng = this.roomMapCenterLng.toFixed(6);
    const marker = this.roomMapLat !== null && this.roomMapLng !== null
      ? `&markers=${this.roomMapLat.toFixed(6)},${this.roomMapLng.toFixed(6)},red-pushpin`
      : '';
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${centerLat},${centerLng}&zoom=${this.roomMapZoom}&size=640x320&maptype=mapnik${marker}`;
  }

  onResourceTypeChanged(): void {
    if (!this.isRoomResourceForm) {
      return;
    }
    if (this.roomMapLat === null || this.roomMapLng === null) {
      this.roomMapCenterLat = this.defaultRoomMapLat;
      this.roomMapCenterLng = this.defaultRoomMapLng;
      this.roomMapZoom = 15;
    }
  }

  onRoomMapClick(event: MouseEvent): void {
    const mapEl = event.currentTarget as HTMLElement | null;
    if (!mapEl) {
      return;
    }
    const rect = mapEl.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;

    const centerPixels = this.latLngToGlobalPixels(this.roomMapCenterLat, this.roomMapCenterLng, this.roomMapZoom);
    const clickedGlobalX = centerPixels.x + (localX - rect.width / 2);
    const clickedGlobalY = centerPixels.y + (localY - rect.height / 2);
    const clicked = this.globalPixelsToLatLng(clickedGlobalX, clickedGlobalY, this.roomMapZoom);

    this.roomMapLat = clicked.lat;
    this.roomMapLng = clicked.lng;
    this.roomMapCenterLat = clicked.lat;
    this.roomMapCenterLng = clicked.lng;
  }

  panRoomMap(direction: 'up' | 'down' | 'left' | 'right'): void {
    const panStepPx = 140;
    let dx = 0;
    let dy = 0;
    if (direction === 'up') dy = -panStepPx;
    if (direction === 'down') dy = panStepPx;
    if (direction === 'left') dx = -panStepPx;
    if (direction === 'right') dx = panStepPx;

    const centerPixels = this.latLngToGlobalPixels(this.roomMapCenterLat, this.roomMapCenterLng, this.roomMapZoom);
    const nextCenter = this.globalPixelsToLatLng(centerPixels.x + dx, centerPixels.y + dy, this.roomMapZoom);
    this.roomMapCenterLat = nextCenter.lat;
    this.roomMapCenterLng = nextCenter.lng;
  }

  zoomRoomMap(delta: number): void {
    const nextZoom = Math.max(3, Math.min(19, this.roomMapZoom + delta));
    this.roomMapZoom = nextZoom;
  }

  centerRoomMapOnPin(): void {
    if (this.roomMapLat === null || this.roomMapLng === null) {
      return;
    }
    this.roomMapCenterLat = this.roomMapLat;
    this.roomMapCenterLng = this.roomMapLng;
  }

  get roomCoordinateLabel(): string {
    if (this.roomMapLat === null || this.roomMapLng === null) {
      return 'No location selected yet.';
    }
    return `Pinned at ${this.roomMapLat.toFixed(6)}, ${this.roomMapLng.toFixed(6)}`;
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
    const map: Record<ResourceType, string> = {
      CLASSROOM: 'Classroom', COMPUTER_LAB: 'Computer Lab', AMPHITHEATER: 'Amphitheater',
      PROJECTOR: 'Projector', LAPTOP: 'Laptop', SMARTBOARD: 'Smartboard', CUSTOM_EQUIPMENT: 'Custom Equipment'
    };
    return map[type] ?? type;
  }

  typeIcon(type: ResourceType): string {
    const map: Record<ResourceType, string> = {
      CLASSROOM: '🏫', COMPUTER_LAB: '🖥️', AMPHITHEATER: '🎭',
      PROJECTOR: '📽️', LAPTOP: '💻', SMARTBOARD: '📋', CUSTOM_EQUIPMENT: '🔧'
    };
    return map[type] ?? '📦';
  }

  typeBadgeClass(type: ResourceType): string {
    const map: Record<ResourceType, string> = {
      CLASSROOM: 'res-badge-classroom', COMPUTER_LAB: 'res-badge-computer-lab',
      AMPHITHEATER: 'res-badge-amphitheater', PROJECTOR: 'res-badge-projector',
      LAPTOP: 'res-badge-laptop', SMARTBOARD: 'res-badge-smartboard',
      CUSTOM_EQUIPMENT: 'res-badge-custom'
    };
    return map[type] ?? 'res-badge-default';
  }

  private buildResourceLocation(): string | null {
    if (!this.isRoomResourceForm || this.roomMapLat === null || this.roomMapLng === null) {
      return this.editingResource?.location ?? null;
    }
    return `${this.roomMapLat.toFixed(6)}, ${this.roomMapLng.toFixed(6)}`;
  }

  private buildResourceAttributes(): Record<string, any> | null {
    const base = this.getResourceAttributes(this.editingResource);
    if (this.isRoomResourceForm && this.roomMapLat !== null && this.roomMapLng !== null) {
      base['mapLocation'] = { lat: this.roomMapLat, lng: this.roomMapLng, zoom: this.roomMapZoom };
    } else {
      delete base['mapLocation'];
    }
    return Object.keys(base).length ? base : null;
  }

  private initializeRoomMap(resource: Resource | null): void {
    const mapLocation = this.extractRoomMapLocation(resource);
    if (mapLocation) {
      this.roomMapLat = mapLocation.lat;
      this.roomMapLng = mapLocation.lng;
      this.roomMapCenterLat = mapLocation.lat;
      this.roomMapCenterLng = mapLocation.lng;
      this.roomMapZoom = mapLocation.zoom ?? 15;
      return;
    }
    this.roomMapLat = null;
    this.roomMapLng = null;
    this.roomMapCenterLat = this.defaultRoomMapLat;
    this.roomMapCenterLng = this.defaultRoomMapLng;
    this.roomMapZoom = 15;
  }

  private extractRoomMapLocation(resource: Resource | null): RoomMapLocation | null {
    if (!resource) {
      return null;
    }
    const metadata = this.getResourceAttributes(resource);
    const mapLocation = metadata?.['mapLocation'];
    if (!mapLocation || typeof mapLocation !== 'object') {
      return this.extractRoomMapLocationFromText(resource.location);
    }
    const mapPoint = mapLocation as Record<string, unknown>;
    const lat = Number(mapPoint['lat']);
    const lng = Number(mapPoint['lng']);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }
    const zoom = Number(mapPoint['zoom']);
    return {
      lat,
      lng,
      zoom: Number.isFinite(zoom) ? Math.max(3, Math.min(19, zoom)) : 15
    };
  }

  private extractRoomMapLocationFromText(location: string | null): RoomMapLocation | null {
    if (!location) {
      return null;
    }
    const [rawLat, rawLng] = location.split(',').map(part => part.trim());
    if (!rawLat || !rawLng) {
      return null;
    }
    const lat = Number(rawLat);
    const lng = Number(rawLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }
    return { lat, lng, zoom: 15 };
  }

  private getResourceAttributes(resource: Resource | null): Record<string, any> {
    if (!resource) return {};
    if (resource.attributes && typeof resource.attributes === 'object') {
      return { ...resource.attributes };
    }
    return {};
  }

  private latLngToGlobalPixels(lat: number, lng: number, zoom: number): { x: number; y: number } {
    const tileSize = 256;
    const scale = Math.pow(2, zoom) * tileSize;
    const x = ((lng + 180) / 360) * scale;
    const sinLat = Math.sin((lat * Math.PI) / 180);
    const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
    return { x, y };
  }

  private globalPixelsToLatLng(x: number, y: number, zoom: number): { lat: number; lng: number } {
    const tileSize = 256;
    const scale = Math.pow(2, zoom) * tileSize;
    const lng = (x / scale) * 360 - 180;
    const n = Math.PI - (2 * Math.PI * y) / scale;
    const lat = (180 / Math.PI) * Math.atan(Math.sinh(n));
    return { lat: Math.max(-85.0511, Math.min(85.0511, lat)), lng: this.normalizeLongitude(lng) };
  }

  private normalizeLongitude(lng: number): number {
    let normalized = lng;
    while (normalized > 180) normalized -= 360;
    while (normalized < -180) normalized += 360;
    return normalized;
  }
}

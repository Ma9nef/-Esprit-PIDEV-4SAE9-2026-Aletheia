import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LibraryService, Product, StockMovement, FileUploadResponse } from 'src/app/core/services/library.service';

interface LibraryResource {
  id?: number;
  title: string;
  description: string;
  category: string;
  resourceType: string;
  downloadUrl?: string;
  imageUrl?: string;
  createdDate?: string;
  stockQuantity?: number;
  stockThreshold?: number;
  lowStock?: boolean;
  price?: number;
}

@Component({
  standalone: false,
  selector: 'app-manage-library',
  templateUrl: './manage-library.component.html',
  styleUrls: ['./manage-library.component.css']
})
export class ManageLibraryComponent implements OnInit {

  resources: LibraryResource[] = [];
  filteredResources: LibraryResource[] = [];
  loading = false;
  error: string | null = null;

  resourceForm: FormGroup;
  showForm = false;
  editingId: number | null = null;

  searchQuery = '';
  sortBy = 'title';
  sortOrder: 'asc' | 'desc' = 'asc';

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  selectedCategory = 'all';
  selectedType = 'all';

  categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'book', name: 'Book' },
    { id: 'pdf', name: 'PDF' },
    { id: 'children_material', name: 'Children Material' },
    { id: 'exam', name: 'Exam' }
  ];

  resourceTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'book', name: 'Book' },
    { id: 'pdf', name: 'PDF' },
    { id: 'children_material', name: 'Children Material' },
    { id: 'exam', name: 'Exam' }
  ];

  // Stock management
  showStockModal = false;
  stockResource: LibraryResource | null = null;
  stockAction: 'add' | 'remove' = 'add';
  stockQuantity = 1;
  stockReason = '';
  stockMovements: StockMovement[] = [];
  showMovementsModal = false;
  movementsResource: LibraryResource | null = null;
  lowStockCount = 0;
  showLowStockOnly = false;

  // File upload state
  productFile: File | null = null;
  productFileUrl: string | null = null;
  productFileName: string | null = null;
  productFileUploading = false;

  coverImageFile: File | null = null;
  coverImageUrl: string | null = null;
  coverImagePreview: string | null = null;
  coverImageUploading = false;
  coverImageMode: 'upload' | 'generate' = 'generate'; // default: auto-generate

  constructor(private libraryService: LibraryService, private fb: FormBuilder) {
    this.resourceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['book', Validators.required],
      resourceType: ['book', Validators.required],
      price: [0, [Validators.min(0)]],
      stockQuantity: [0, [Validators.min(0)]],
      stockThreshold: [5, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.loading = true;
    this.error = null;

    this.libraryService.getAll().subscribe({
      next: (data) => {
        this.resources = data.map(product => ({
          id: product.id,
          title: product.title,
          description: product.description || '',
          category: (product.type || 'BOOK').toLowerCase(),
          resourceType: (product.type || 'BOOK').toLowerCase(),
          downloadUrl: product.fileUrl,
          imageUrl: product.coverImageUrl,
          createdDate: product.createdAt || product.updatedAt,
          stockQuantity: product.stockQuantity ?? 0,
          stockThreshold: product.stockThreshold ?? 5,
          lowStock: product.lowStock ?? false,
          price: product.price ?? 0
        }));

        this.lowStockCount = this.resources.filter(r => r.lowStock).length;
        console.log('Loaded resources:', this.resources);
        this.filterAndSort();
        this.loading = false;
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.message || 'Failed to load resources';
        this.error = `Unable to load resources from API: ${errorMsg}`;
        // Fallback to mock data like front-office does
        console.warn('⚠️ API Error - loading mock data:', errorMsg);
        this.resources = this.getMockData();
        this.filterAndSort();
        this.loading = false;
      }
    });
  }

  filterAndSort(): void {
    this.filteredResources = this.resources.filter(r => {
      const matchesSearch =
        r.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'all' || r.category === this.selectedCategory.toLowerCase();

      const matchesType =
        this.selectedType === 'all' || r.resourceType === this.selectedType.toLowerCase();

      const matchesLowStock = !this.showLowStockOnly || r.lowStock;

      return matchesSearch && matchesCategory && matchesType && matchesLowStock;
    });

    this.filteredResources.sort((a, b) => {
      let aVal: any = a[this.sortBy as keyof LibraryResource];
      let bVal: any = b[this.sortBy as keyof LibraryResource];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      return this.sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    this.totalItems = this.filteredResources.length;
  }

  openAddForm(): void {
    this.showForm = true;
    this.editingId = null;
    this.resourceForm.reset({ category: 'book', resourceType: 'book', price: 0, stockQuantity: 0, stockThreshold: 5 });
    this.resetFileUploadState();
  }

  openEditForm(resource: LibraryResource): void {
    this.showForm = true;
    this.editingId = resource.id || null;
    this.resourceForm.patchValue({
      ...resource,
      category: resource.category.toLowerCase(),
      resourceType: resource.resourceType.toLowerCase(),
      price: resource.price ?? 0,
      stockQuantity: resource.stockQuantity ?? 0,
      stockThreshold: resource.stockThreshold ?? 5
    });
    // Restore existing file URLs if present
    this.resetFileUploadState();
    if (resource.downloadUrl) {
      this.productFileUrl = resource.downloadUrl;
      this.productFileName = resource.downloadUrl.split('/').pop() || 'Existing file';
    }
    if (resource.imageUrl) {
      this.coverImageUrl = resource.imageUrl;
      this.coverImagePreview = resource.imageUrl;
      this.coverImageMode = 'upload';
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.resourceForm.reset({ category: 'book', resourceType: 'book', price: 0, stockQuantity: 0, stockThreshold: 5 });
    this.resetFileUploadState();
  }

  resetFileUploadState(): void {
    this.productFile = null;
    this.productFileUrl = null;
    this.productFileName = null;
    this.productFileUploading = false;
    this.coverImageFile = null;
    this.coverImageUrl = null;
    this.coverImagePreview = null;
    this.coverImageUploading = false;
    this.coverImageMode = 'generate';
  }

  saveResource(): void {
    if (this.resourceForm.invalid) return;

    const resource: LibraryResource = this.resourceForm.value;
    // Attach uploaded file URLs
    resource.downloadUrl = this.productFileUrl || undefined;

    // If cover mode is generate, create a data URL; otherwise use uploaded URL
    if (this.coverImageMode === 'generate') {
      resource.imageUrl = this.generateCoverDataUrl(
        resource.title,
        this.resourceForm.get('resourceType')?.value || 'book'
      );
    } else {
      resource.imageUrl = this.coverImageUrl || undefined;
    }

    if (this.editingId) {
      this.updateResource(this.editingId, resource);
    } else {
      this.createResource(resource);
    }
  }

  createResource(resource: LibraryResource): void {
    const product: Product = {
      title: resource.title,
      description: resource.description,
      type: resource.resourceType.toUpperCase(),
      fileUrl: resource.downloadUrl || undefined,
      coverImageUrl: resource.imageUrl || undefined,
      available: true,
      price: this.resourceForm.get('price')?.value ?? 0,
      stockQuantity: this.resourceForm.get('stockQuantity')?.value ?? 0,
      stockThreshold: this.resourceForm.get('stockThreshold')?.value ?? 5
    };

    this.libraryService.create(product).subscribe({
      next: (created) => {
        this.resources.push({
          id: created.id,
          title: created.title,
          description: created.description || '',
          category: created.type.toLowerCase(),
          resourceType: created.type.toLowerCase(),
          downloadUrl: created.fileUrl,
          imageUrl: created.coverImageUrl,
          createdDate: created.createdAt,
          stockQuantity: created.stockQuantity ?? 0,
          stockThreshold: created.stockThreshold ?? 5,
          lowStock: created.lowStock ?? false,
          price: created.price ?? 0
        });
        this.lowStockCount = this.resources.filter(r => r.lowStock).length;
        this.filterAndSort();
        this.closeForm();
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.message || 'Failed to create resource';
        this.error = `Failed to create resource: ${errorMsg}`;
      }
    });
  }

  updateResource(id: number, resource: LibraryResource): void {
    const product: Product = {
      id,
      title: resource.title,
      description: resource.description,
      type: resource.resourceType.toUpperCase(),
      fileUrl: resource.downloadUrl || undefined,
      coverImageUrl: resource.imageUrl || undefined,
      available: true,
      price: this.resourceForm.get('price')?.value ?? 0,
      stockThreshold: this.resourceForm.get('stockThreshold')?.value ?? 5
    };

    this.libraryService.update(id, product).subscribe({
      next: () => {
        const index = this.resources.findIndex(r => r.id === id);
        if (index > -1) {
          this.resources[index] = {
            ...resource,
            id,
            stockThreshold: this.resourceForm.get('stockThreshold')?.value ?? 5,
            lowStock: (this.resources[index].stockQuantity ?? 0) <= (this.resourceForm.get('stockThreshold')?.value ?? 5)
          };
        }
        this.lowStockCount = this.resources.filter(r => r.lowStock).length;
        this.filterAndSort();
        this.closeForm();
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.message || 'Failed to update resource';
        this.error = `Failed to update resource: ${errorMsg}`;
      }
    });
  }

  deleteResource(id?: number): void {
    if (!id || !confirm('Are you sure you want to delete this resource?')) return;

    this.libraryService.delete(id).subscribe({
      next: () => {
        this.resources = this.resources.filter(r => r.id !== id);
        this.filterAndSort();
      },
      error: () => {
        this.error = 'Failed to delete resource';
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
    this.filterAndSort();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category.toLowerCase();
    this.currentPage = 1;
    this.filterAndSort();
  }

  onTypeChange(type: string): void {
    this.selectedType = type.toLowerCase();
    this.currentPage = 1;
    this.filterAndSort();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.filterAndSort();
  }

  getPaginatedResources(): LibraryResource[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredResources.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  previousPage(): void { if (this.currentPage > 1) this.currentPage--; }
  nextPage(): void { if (this.currentPage < this.totalPages) this.currentPage++; }

  // ─── Stock Management Methods ──────────────────────────────────────────────

  toggleLowStockFilter(): void {
    this.showLowStockOnly = !this.showLowStockOnly;
    this.currentPage = 1;
    this.filterAndSort();
  }

  openStockModal(resource: LibraryResource, action: 'add' | 'remove'): void {
    this.stockResource = resource;
    this.stockAction = action;
    this.stockQuantity = 1;
    this.stockReason = '';
    this.showStockModal = true;
  }

  closeStockModal(): void {
    this.showStockModal = false;
    this.stockResource = null;
    this.stockQuantity = 1;
    this.stockReason = '';
  }

  submitStockAdjustment(): void {
    if (!this.stockResource?.id || this.stockQuantity < 1) return;

    const request = { quantity: this.stockQuantity, reason: this.stockReason };
    const obs = this.stockAction === 'add'
      ? this.libraryService.addStock(this.stockResource.id, request)
      : this.libraryService.removeStock(this.stockResource.id, request);

    obs.subscribe({
      next: (updated) => {
        const index = this.resources.findIndex(r => r.id === this.stockResource?.id);
        if (index > -1) {
          this.resources[index].stockQuantity = updated.stockQuantity ?? 0;
          this.resources[index].lowStock = updated.lowStock ?? false;
        }
        this.lowStockCount = this.resources.filter(r => r.lowStock).length;
        this.filterAndSort();
        this.closeStockModal();
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.message || 'Stock adjustment failed';
        this.error = `Stock adjustment failed: ${errorMsg}`;
        this.closeStockModal();
      }
    });
  }

  openMovementsModal(resource: LibraryResource): void {
    if (!resource.id) return;
    this.movementsResource = resource;
    this.stockMovements = [];
    this.showMovementsModal = true;

    this.libraryService.getStockMovements(resource.id).subscribe({
      next: (movements) => {
        this.stockMovements = movements;
      },
      error: () => {
        this.error = 'Failed to load stock movements';
      }
    });
  }

  closeMovementsModal(): void {
    this.showMovementsModal = false;
    this.movementsResource = null;
    this.stockMovements = [];
  }

  // ─── File Upload Methods ───────────────────────────────────────────────────

  onProductFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.uploadProductFile(input.files[0]);
  }

  onProductFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!event.dataTransfer?.files || event.dataTransfer.files.length === 0) return;
    this.uploadProductFile(event.dataTransfer.files[0]);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  uploadProductFile(file: File): void {
    this.productFile = file;
    this.productFileName = file.name;
    this.productFileUploading = true;

    this.libraryService.uploadProductFile(file).subscribe({
      next: (res) => {
        this.productFileUrl = res.url;
        this.productFileUploading = false;
      },
      error: (err) => {
        console.error('Product file upload failed:', err);
        const msg = err?.error?.error || err?.error?.message || err?.message || 'Unknown error';
        this.error = `Failed to upload product file: ${msg}`;
        this.productFileUploading = false;
        this.productFile = null;
        this.productFileName = null;
      }
    });
  }

  removeProductFile(): void {
    this.productFile = null;
    this.productFileUrl = null;
    this.productFileName = null;
  }

  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.uploadCoverImage(input.files[0]);
  }

  onCoverImageDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!event.dataTransfer?.files || event.dataTransfer.files.length === 0) return;
    const file = event.dataTransfer.files[0];
    if (!file.type.startsWith('image/')) {
      this.error = 'Only image files are allowed for cover images.';
      return;
    }
    this.uploadCoverImage(file);
  }

  uploadCoverImage(file: File): void {
    this.coverImageFile = file;
    this.coverImageUploading = true;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      this.coverImagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.libraryService.uploadCoverImage(file).subscribe({
      next: (res) => {
        this.coverImageUrl = res.url;
        this.coverImageUploading = false;
      },
      error: (err) => {
        console.error('Cover image upload failed:', err);
        const msg = err?.error?.error || err?.error?.message || err?.message || 'Unknown error';
        this.error = `Failed to upload cover image: ${msg}`;
        this.coverImageUploading = false;
        this.coverImageFile = null;
        this.coverImagePreview = null;
      }
    });
  }

  removeCoverImage(): void {
    this.coverImageFile = null;
    this.coverImageUrl = null;
    this.coverImagePreview = null;
  }

  setCoverImageMode(mode: 'upload' | 'generate'): void {
    this.coverImageMode = mode;
    if (mode === 'generate') {
      this.removeCoverImage();
    }
  }

  /** Generate a cover image as a data URL using a canvas */
  generateCoverDataUrl(title: string, type: string): string {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Gradient background based on type
    const colors = this.getGradientForType(type);
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);

    // Add subtle pattern
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(50 + i * 50, 150, 80, 0, Math.PI * 2);
      ctx.fill();
    }

    // Type label at top
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(type.toUpperCase().replace('_', ' '), 200, 40);

    // Initials / icon
    const initials = this.getInitials(title);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = 'bold 120px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 200, 140);

    // Title text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    // Word wrap title
    const words = title.split(' ');
    let line = '';
    let y = 240;
    const maxWidth = 340;
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      if (ctx.measureText(testLine).width > maxWidth && line) {
        ctx.fillText(line, 200, y);
        line = word;
        y += 26;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 200, y);

    return canvas.toDataURL('image/png');
  }

  getInitials(title: string): string {
    if (!title || !title.trim()) return '??';
    const words = title.trim().split(/\s+/);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  getGradientForType(type: string): [string, string] {
    switch (type.toLowerCase()) {
      case 'pdf': return ['#ef4444', '#dc2626'];
      case 'exam': return ['#f59e0b', '#d97706'];
      case 'book': return ['#6366f1', '#4f46e5'];
      case 'children_material': return ['#10b981', '#059669'];
      default: return ['#6366f1', '#8b5cf6'];
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  getGeneratedCoverPreview(): string {
    const title = this.resourceForm.get('title')?.value || 'Preview';
    const type = this.resourceForm.get('resourceType')?.value || 'book';
    return this.generateCoverDataUrl(title, type);
  }

  getMockData(): LibraryResource[] {
    return [
      {
        id: 1,
        title: 'Spring Boot Complete Guide',
        description: 'Comprehensive guide to building microservices with Spring Boot and Spring Cloud.',
        category: 'pdf',
        resourceType: 'pdf'
      },
      {
        id: 2,
        title: 'Angular Best Practices',
        description: 'Learn modern Angular patterns, dependency injection, and reactive programming.',
        category: 'pdf',
        resourceType: 'pdf'
      },
      {
        id: 3,
        title: 'Python Data Science Tutorial',
        description: 'Master data manipulation, analysis, and visualization with Python.',
        category: 'book',
        resourceType: 'book'
      },
      {
        id: 4,
        title: 'Docker & Kubernetes Essentials',
        description: 'Complete guide to containerization and orchestration technologies.',
        category: 'book',
        resourceType: 'book'
      }
    ];
  }
}

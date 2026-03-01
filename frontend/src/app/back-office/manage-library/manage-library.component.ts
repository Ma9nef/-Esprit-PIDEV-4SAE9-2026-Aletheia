import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LibraryService, Product } from 'src/app/core/services/library.service';

interface LibraryResource {
  id?: number;
  title: string;
  description: string;
  category: string;
  resourceType: string;
  downloadUrl?: string;
  imageUrl?: string;
  createdDate?: string;
}

@Component({
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

  constructor(private libraryService: LibraryService, private fb: FormBuilder) {
    this.resourceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['book', Validators.required],
      resourceType: ['book', Validators.required],
      downloadUrl: [''],
      imageUrl: ['']
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
          createdDate: product.createdAt || product.updatedAt
        }));

        console.log('Loaded resources:', this.resources); // debug
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

      return matchesSearch && matchesCategory && matchesType;
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
    this.resourceForm.reset({ category: 'book', resourceType: 'book' });
  }

  openEditForm(resource: LibraryResource): void {
    this.showForm = true;
    this.editingId = resource.id || null;
    this.resourceForm.patchValue({
      ...resource,
      category: resource.category.toLowerCase(),
      resourceType: resource.resourceType.toLowerCase()
    });
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.resourceForm.reset({ category: 'book', resourceType: 'book' });
  }

  saveResource(): void {
    if (this.resourceForm.invalid) return;

    const resource: LibraryResource = this.resourceForm.value;

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
      price: 0
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
          createdDate: created.createdAt
        });
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
      price: 0
    };

    this.libraryService.update(id, product).subscribe({
      next: () => {
        const index = this.resources.findIndex(r => r.id === id);
        if (index > -1) this.resources[index] = { ...resource, id };
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

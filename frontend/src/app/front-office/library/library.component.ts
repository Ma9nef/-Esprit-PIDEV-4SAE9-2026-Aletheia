import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Product {
  id: number;
  title: string;
  description: string;
  author?: string;
  type: string; // BOOK, PDF, CHILDREN_MATERIAL, EXAM
  price?: number;
  fileUrl?: string;
  coverImageUrl?: string;
  available?: boolean;
  stockQuantity?: number;
  stockThreshold?: number;
  lowStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface LibraryResource {
  id: number;
  title: string;
  description: string;
  category: string;
  resourceType: string;
  downloadUrl?: string;
  imageUrl?: string;
  createdDate?: string;
  stockQuantity?: number;
  lowStock?: boolean;
}

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  libraryResources: LibraryResource[] = [];
  filteredResources: LibraryResource[] = [];
  loading = true;
  error: string | null = null;
  searchQuery = '';
  selectedCategory = 'all';
  selectedResourceType = 'all';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadLibraryResources();
  }

  loadLibraryResources(): void {
    this.loading = true;
    this.error = null;
    // Call the actual backend API endpoint
    this.http.get<Product[]>('/api/products')
      .subscribe({
        next: (data) => {
          // Map Product objects to LibraryResource format
          this.libraryResources = data.map(product => ({
            id: product.id,
            title: product.title,
            description: product.description || '',
            category: product.type.toLowerCase(),
            resourceType: product.type.toLowerCase(),
            downloadUrl: product.fileUrl,
            imageUrl: product.coverImageUrl,
            createdDate: product.createdAt || product.updatedAt,
            stockQuantity: product.stockQuantity ?? 0,
            lowStock: product.lowStock ?? false
          }));
          this.filterResources();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading library resources:', err);
          this.error = 'Failed to load resources. Using mock data.';
          // Mock data for development
          this.libraryResources = this.getMockData();
          this.filterResources();
          this.loading = false;
        }
      });
  }

  filterResources(): void {
    this.filteredResources = this.libraryResources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           resource.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || resource.category === this.selectedCategory;
      const matchesType = this.selectedResourceType === 'all' || resource.resourceType === this.selectedResourceType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.filterResources();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filterResources();
  }

  onResourceTypeChange(type: string): void {
    this.selectedResourceType = type;
    this.filterResources();
  }

  downloadResource(resource: LibraryResource): void {
    if (resource.downloadUrl) {
      window.open(resource.downloadUrl, '_blank');
    }
  }

  getMockData(): LibraryResource[] {
    return [
      {
        id: 1,
        title: 'Spring Boot Complete Guide',
        description: 'Comprehensive guide to building microservices with Spring Boot and Spring Cloud.',
        category: 'pdf',
        resourceType: 'pdf',
        imageUrl: 'assets/library/spring-boot.png'
      },
      {
        id: 2,
        title: 'Angular Best Practices',
        description: 'Learn modern Angular patterns, dependency injection, and reactive programming.',
        category: 'pdf',
        resourceType: 'pdf',
        imageUrl: 'assets/library/angular-best-practices.png'
      },
      {
        id: 3,
        title: 'Python Data Science Tutorial',
        description: 'Master data manipulation, analysis, and visualization with Python.',
        category: 'book',
        resourceType: 'book',
        imageUrl: 'assets/library/python-ds.png'
      },
      {
        id: 4,
        title: 'Docker & Kubernetes Essentials',
        description: 'Complete guide to containerization and orchestration technologies.',
        category: 'book',
        resourceType: 'book',
        imageUrl: 'assets/library/docker-k8s.png'
      },
      {
        id: 5,
        title: 'Machine Learning Algorithms',
        description: 'Understanding ML algorithms: supervised, unsupervised, and deep learning.',
        category: 'pdf',
        resourceType: 'pdf',
        imageUrl: 'assets/library/ml-algorithms.png'
      },
      {
        id: 6,
        title: 'RESTful API Design',
        description: 'Best practices for designing and building RESTful APIs.',
        category: 'pdf',
        resourceType: 'pdf',
        imageUrl: 'assets/library/api-design.png'
      },
      {
        id: 7,
        title: 'TypeScript Advanced Patterns',
        description: 'Learn advanced TypeScript patterns and techniques for scalable applications.',
        category: 'pdf',
        resourceType: 'pdf',
        imageUrl: 'assets/library/typescript-patterns.png'
      },
      {
        id: 8,
        title: 'CI/CD Pipeline Setup',
        description: 'Implement automated testing and deployment pipelines.',
        category: 'exam',
        resourceType: 'exam',
        imageUrl: 'assets/library/cicd.png'
      }
    ];
  }
}


import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService, ConfirmationService } from 'primeng/api';

// products-list is at: src/app/features/products/products-list/
// core/models is at:   src/app/core/models/
// relative path:       ../../../core/models/
import { Product, ProductFilter, ProductType } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    TableModule, ButtonModule, InputTextModule, SelectModule,
    TagModule, ToastModule, ConfirmDialogModule, TooltipModule, SkeletonModule,
    ProductFormComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = false;
  showFormDialog = false;
  selectedProduct: Product | null = null;

  filter: ProductFilter = { search: '', type: null, available: null };
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  typeOptions = [
    { label: 'All Types',    value: null },
    { label: '📚 Book',      value: 'BOOK' },
    { label: '📱 Ebook',     value: 'EBOOK' },
    { label: '🎧 Audiobook', value: 'AUDIOBOOK' },
    { label: '📰 Magazine',  value: 'MAGAZINE' },
  ];

  availabilityOptions = [
    { label: 'All',              value: null },
    { label: '✅ Available',     value: true },
    { label: '❌ Unavailable',   value: false },
  ];

  typeSeverityMap: Record<ProductType, 'success' | 'info' | 'warn' | 'danger'> = {
    BOOK:      'info',
    EBOOK:     'success',
    AUDIOBOOK: 'warn',
    MAGAZINE:  'danger',
  };

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.loadProducts());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll(this.filter).subscribe({
      next: (data: Product[]) => { this.products = data; this.loading = false; },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error', summary: 'Error',
          detail: 'Could not load products. Is the backend running?'
        });
      }
    });
  }

  onSearchChange(value: string): void {
    this.filter.search = value;
    this.searchSubject.next(value);
  }

  onFilterChange(): void {
    this.loadProducts();
  }

  clearFilters(): void {
    this.filter = { search: '', type: null, available: null };
    this.loadProducts();
  }

  openCreate(): void {
    this.selectedProduct = null;
    this.showFormDialog = true;
  }

  openEdit(product: Product): void {
    this.selectedProduct = { ...product };
    this.showFormDialog = true;
  }

  onFormSaved(saved: Product): void {
    this.showFormDialog = false;
    this.loadProducts();
    this.messageService.add({
      severity: 'success', summary: 'Saved!',
      detail: `"${saved.title}" was saved successfully.`, life: 3000
    });
  }

  confirmDelete(product: Product, event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to delete "<strong>${product.title}</strong>"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.productService.delete(product.id!).subscribe({
          next: () => {
            this.loadProducts();
            this.messageService.add({
              severity: 'success', summary: 'Deleted',
              detail: `"${product.title}" was removed.`, life: 3000
            });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product.' });
          }
        });
      }
    });
  }

  getTypeSeverity(type: ProductType): 'success' | 'info' | 'warn' | 'danger' {
    return this.typeSeverityMap[type] ?? 'info';
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.filter.search?.trim())    count++;
    if (this.filter.type != null)      count++;
    if (this.filter.available != null) count++;
    return count;
  }
}

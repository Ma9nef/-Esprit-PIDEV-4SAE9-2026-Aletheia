import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';

import { Product, ProductFilter, ProductType } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SkeletonModule, SelectModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  searchTerm = '';
  activeType: ProductType | null = null;
  private search$ = new Subject<string>();

  sortOptions = [
    { label: 'Newest first',    value: 'newest' },
    { label: 'Price: Low–High', value: 'price_asc' },
    { label: 'Price: High–Low', value: 'price_desc' },
    { label: 'A → Z',           value: 'alpha' },
  ];
  sortBy = 'newest';

  typeFilters: { label: string; value: ProductType | null }[] = [
    { label: 'All',        value: null },
    { label: 'Books',      value: 'BOOK' },
    { label: 'Ebooks',     value: 'EBOOK' },
    { label: 'Audiobooks', value: 'AUDIOBOOK' },
    { label: 'Magazines',  value: 'MAGAZINE' },
  ];

  skeletons = Array(8).fill(0);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.load();
    this.search$.pipe(debounceTime(380), distinctUntilChanged())
      .subscribe(() => this.load());
  }

  load(): void {
    this.loading = true;
    const filter: ProductFilter = {
      search: this.searchTerm || undefined,
      type: this.activeType,
      available: true,
    };
    this.productService.getAll(filter).subscribe({
      next: (data: Product[]) => { this.products = this.sorted(data); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch(val: string): void { this.searchTerm = val; this.search$.next(val); }
  setType(t: ProductType | null): void { this.activeType = t; this.load(); }
  onSort(): void { this.products = this.sorted([...this.products]); }

  sorted(list: Product[]): Product[] {
    switch (this.sortBy) {
      case 'price_asc':  return list.sort((a, b) => a.price - b.price);
      case 'price_desc': return list.sort((a, b) => b.price - a.price);
      case 'alpha':      return list.sort((a, b) => a.title.localeCompare(b.title));
      default:           return list.sort((a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    }
  }

  typeEmoji(t: ProductType): string {
    return { BOOK: '📚', EBOOK: '📱', AUDIOBOOK: '🎧', MAGAZINE: '📰' }[t] ?? '📦';
  }

  get resultLabel(): string {
    const n = this.products.length;
    return `${n} ${n === 1 ? 'title' : 'titles'}`;
  }
}

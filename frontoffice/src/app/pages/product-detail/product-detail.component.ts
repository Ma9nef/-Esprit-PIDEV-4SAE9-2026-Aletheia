import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';

import { Product, ProductType } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonModule, DividerModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error   = false;

  constructor(private route: ActivatedRoute, private svc: ProductService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(id).subscribe({
      next: (p: Product) => { this.product = p; this.loading = false; },
      error: ()           => { this.error = true; this.loading = false; }
    });
  }

  emoji(t: ProductType): string {
    return { BOOK: '📚', EBOOK: '📱', AUDIOBOOK: '🎧', MAGAZINE: '📰' }[t] ?? '📦';
  }

  typeLabel(t: ProductType): string {
    return { BOOK: 'Book', EBOOK: 'Ebook', AUDIOBOOK: 'Audiobook', MAGAZINE: 'Magazine' }[t] ?? t;
  }

  readLabel(t: ProductType): string {
    return t === 'AUDIOBOOK' ? 'Listen now' : 'Read now';
  }

  open(): void {
    if (this.product?.fileUrl) window.open(this.product.fileUrl, '_blank');
  }
}

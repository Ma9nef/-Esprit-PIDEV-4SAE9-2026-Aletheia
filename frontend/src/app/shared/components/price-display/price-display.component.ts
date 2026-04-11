import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="price-display">
      <span class="current-price">{{ price | number:'1.2-2' }} {{ currency }}</span>
      <span class="original-price" *ngIf="originalPrice && originalPrice > price">
        {{ originalPrice | number:'1.2-2' }} {{ currency }}
      </span>
    </div>
  `,
  styles: [`
    .price-display {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .current-price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #4CAF50;
    }
    .original-price {
      font-size: 0.9rem;
      color: #999;
      text-decoration: line-through;
    }
  `]
})
export class PriceDisplayComponent {
  @Input() price!: number;
  @Input() originalPrice?: number;
  @Input() currency: string = '€';
}

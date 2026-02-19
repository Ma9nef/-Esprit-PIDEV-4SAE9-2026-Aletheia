import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-inner">
        <span class="footer-logo">𝔄 Aletheia</span>
        <span class="footer-copy">© {{ year }} Aletheia Platform. All rights reserved.</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      border-top: 1px solid var(--border);
      background: var(--surface);
      padding: 1.75rem 0;
    }
    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .footer-logo {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1rem;
      color: var(--ink);
    }
    .footer-copy {
      font-size: 0.8rem;
      color: var(--ink-muted);
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}

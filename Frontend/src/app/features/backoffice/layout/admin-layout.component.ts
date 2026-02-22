import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-layout">
      <nav class="admin-nav">
        <div class="nav-brand">
          <a routerLink="/admin">Backoffice</a>
        </div>
        <ul class="nav-links">
          <li><a routerLink="/admin/offers" routerLinkActive="active">Offres</a></li>
          <li><a routerLink="/admin/coupons" routerLinkActive="active">Coupons</a></li>
          <li><a routerLink="/admin/flash-sales" routerLinkActive="active">Flash Sales</a></li>
        </ul>
        <a routerLink="/offers" class="nav-front">← Frontoffice</a>
      </nav>
      <main class="admin-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout { display: flex; min-height: 100vh; }
    .admin-nav {
      width: 220px;
      background: #2d3748;
      color: #fff;
      padding: 1.5rem;
    }
    .nav-brand a { font-weight: 700; font-size: 1.1rem; color: #fff; text-decoration: none; }
    .nav-links { list-style: none; padding: 0; margin: 1.5rem 0; }
    .nav-links a {
      display: block;
      padding: 0.5rem 0;
      color: #cbd5e0;
      text-decoration: none;
    }
    .nav-links a:hover, .nav-links a.active { color: #fff; }
    .nav-front { color: #90cdf4; font-size: 0.9rem; }
    .admin-content { flex: 1; padding: 2rem; background: #f7fafc; overflow: auto; }
  `]
})
export class AdminLayoutComponent {}

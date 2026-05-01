import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchControl = new FormControl('');

  constructor(private router: Router) {}

  onSearchSubmit(): void {
    const query = this.searchControl.value?.trim();
    if (query) {
      // ✅ goes to CatalogComponent (course list)
      this.router.navigate(['/front/courses'], { queryParams: { search: query } });
    } else {
      this.router.navigate(['/front/courses']);
    }
  }

  navigateToCourses(): void {
    // ✅ goes to CatalogComponent (course list)
    this.router.navigate(['/front/courses']);
  }

  navigateToLibrary(): void {
    // ✅ goes to LibraryComponent
    this.router.navigate(['/front/library']);
  }

  navigateToExplore3d(): void {
    this.router.navigate(['/explore']);
  }

  navigateToLiveSessions(): void {
    // ⚠️ Only keep this if you REALLY have this route in AppRoutingModule
    this.router.navigate(['/live-sessions']);
  }
  navigateToOffers() {
    this.router.navigate(['/offers']);
  }

  navigateToSubscriptionPlans() {
    this.router.navigate(['/plans']);
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
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
      void this.router.navigate(['/front/courses'], { queryParams: { search: query } });
    } else {
      void this.router.navigate(['/front/courses']);
    }
  }

  navigateToCourses(): void {
    void this.router.navigate(['/front/courses']);
  }

  navigateToLibrary(): void {
    void this.router.navigate(['/front/library']);
  }

  navigateToExplore3d(): void {
    void this.router.navigate(['/explore']);
  }

  navigateToLiveSessions(): void {
    void this.router.navigate(['/live-sessions']);
  }

  navigateToOffers(): void {
    void this.router.navigate(['/offers']);
  }

  navigateToSubscriptionPlans(): void {
    void this.router.navigate(['/plans']);
  }

  navigateToFormations(): void {
    void this.router.navigate(['/formations']);
  }
}

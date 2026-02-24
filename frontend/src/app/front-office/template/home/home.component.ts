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
      this.router.navigate(['/courses'], { queryParams: { search: query } });
    }
  }

  navigateToCourses(): void {
    this.router.navigate(['/courses']);
  }

  navigateToLiveSessions(): void {
    this.router.navigate(['/live-sessions']);
  }
}

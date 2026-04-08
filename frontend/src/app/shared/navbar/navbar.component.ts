import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('userDropdown') userDropdown!: ElementRef<HTMLDivElement>;

  isMobileMenuOpen = false;
  isUserDropdownOpen = false;

  searchControl = new FormControl('');
  searchQuery = '';
  currentRoute = '';

  currentUser = {
    name: '',
    email: '',
    avatar: 'https://i.pravatar.cc/150?img=12'
  };

  menuItems = [
    { label: 'Home', route: '/', icon: '🏠' },
    { label: 'About', route: '/about', icon: 'ℹ️' },
    { label: 'Services', route: '/services', icon: '⚙️' },
    { label: 'Explore 3D', route: '/explore', icon: '🌌' },
    { label: 'Library', route: '/front/library', icon: '📖' },
    { label: 'Resources', route: '/front/resources', icon: '🏗️' },
    { label: 'Contact', route: '/contact', icon: '📧' }
  ];

  constructor(
    public router: Router,
    private elementRef: ElementRef,
    public themeService: ThemeService,
    private auth: AuthService
  ) {}

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get isAdmin(): boolean {
    const u = this.auth.getUserFromToken();
    return !!u && (u.role === 'ADMIN' || u.role === 'ROLE_ADMIN');
  }

  get isInstructor(): boolean {
    const u = this.auth.getUserFromToken();
    return !!u && (u.role === 'INSTRUCTOR' || u.role === 'ROLE_INSTRUCTOR');
  }

  get isLearner(): boolean {
    const u = this.auth.getUserFromToken();
    return !!u && (u.role === 'LEARNER' || u.role === 'ROLE_LEARNER');
  }

  ngOnInit(): void {
    this.updateCurrentUser();

    this.currentRoute = this.router.url;

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.router.url;
        this.updateCurrentUser();
      });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(query => {
        this.searchQuery = query || '';
      });
  }

  private updateCurrentUser(): void {
    const u = this.auth.getUserFromToken();

    if (!u) {
      this.currentUser = { name: '', email: '', avatar: 'https://i.pravatar.cc/150?img=12' };
      return;
    }

    this.currentUser.email = u.email;
    this.currentUser.name = u.email.split('@')[0];
  }

  onMyCertificatesClick(): void {
    const role = localStorage.getItem('role');

    if (role === 'ADMIN') {
      this.router.navigate(['/manage-certificates']);
    } else if (role === 'LEARNER') {
      this.router.navigate(['/my-certificates']);
    }
  }

  goToAssessments(): void {
    const role = localStorage.getItem('role');

    if (role === 'ADMIN') {
      this.router.navigate(['/manage-assessments']);
    } else if (role === 'LEARNER') {
      this.router.navigate(['/assessment']);
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    if (this.userDropdown && !this.userDropdown.nativeElement.contains(event.target as Node)) {
      this.isUserDropdownOpen = false;
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isMobileMenuOpen = false;
  }

  onSearchSubmit(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/front/courses'], { queryParams: { search: this.searchQuery } });
      this.isMobileMenuOpen = false;
    }
  }

  onProfileClick(): void {
    this.router.navigate(['/front/profile']);
    this.isUserDropdownOpen = false;
  }

  onMyCoursesClick(): void {
    this.router.navigate(['/front/my-courses']);
    this.isUserDropdownOpen = false;
  }

  onDashboardClick(): void {
    const user = this.auth.getUserFromToken();
    if (user) {
      const role = user.role.toLowerCase();
      if (role === 'admin') {
        this.router.navigate(['/dashboardAdmin']);
      } else if (role === 'trainer' || role === 'instructor') {
        this.router.navigate(['/dashboardInstructor']);
      } else {
        this.router.navigate(['/dashboardLearner']);
      }
    }
    this.isUserDropdownOpen = false;
  }

  onLogout(): void {
    this.auth.logout();
    this.isUserDropdownOpen = false;
    this.isMobileMenuOpen = false;

    this.currentUser = {
      name: '',
      email: '',
      avatar: 'https://i.pravatar.cc/150?img=12'
    };

    this.router.navigate(['/home']);
  }
}

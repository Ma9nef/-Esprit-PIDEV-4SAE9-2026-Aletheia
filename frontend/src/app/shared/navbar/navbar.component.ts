import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('userDropdown') userDropdown!: ElementRef<HTMLDivElement>;

  // ❌ REMOVE: isLoggedIn = false;
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
<<<<<<< HEAD

  private updateCurrentUser(): void {
    const u = this.auth.getUserFromToken();

=======
  
  private updateCurrentUser(): void {
    const u = this.auth.getUserFromToken();
  
>>>>>>> origin/course-managment
    if (!u) {
      this.currentUser = { name: '', email: '', avatar: 'https://i.pravatar.cc/150?img=12' };
      return;
    }
<<<<<<< HEAD

=======
  
>>>>>>> origin/course-managment
    this.currentUser.email = u.email;
    this.currentUser.name = u.email.split('@')[0];
  }

  menuItems = [
    { label: 'Home', route: '/', icon: '🏠' },
    { label: 'About', route: '/about', icon: 'ℹ️' },
    { label: 'Services', route: '/services', icon: '⚙️' },
    { label: 'Contact', route: '/contact', icon: '📧' }
  ];

  constructor(
    public router: Router,
    private elementRef: ElementRef,
    public themeService: ThemeService,
    private auth: AuthService
  ) {}

  // ✅ Always reads current token from localStorage
  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  ngOnInit(): void {
    this.updateCurrentUser();
<<<<<<< HEAD

    this.currentRoute = this.router.url;

=======
  
    this.currentRoute = this.router.url;
  
>>>>>>> origin/course-managment
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.router.url;
        this.updateCurrentUser(); // ✅ refresh user after login redirect
      });
<<<<<<< HEAD

=======
  
>>>>>>> origin/course-managment
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(query => {
        this.searchQuery = query || '';
      });
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
      // ⚠️ use your real route:
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

<<<<<<< HEAD
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

=======
>>>>>>> origin/course-managment
  onLogout(): void {
    this.auth.logout();                  // remove token
    this.isUserDropdownOpen = false;
    this.isMobileMenuOpen = false;
<<<<<<< HEAD

=======
  
>>>>>>> origin/course-managment
    this.currentUser = {
      name: '',
      email: '',
      avatar: 'https://i.pravatar.cc/150?img=12'
    };
<<<<<<< HEAD

    this.router.navigate(['/home']);
  }
}
=======
  
    this.router.navigate(['/home']);
  }
}
>>>>>>> origin/course-managment

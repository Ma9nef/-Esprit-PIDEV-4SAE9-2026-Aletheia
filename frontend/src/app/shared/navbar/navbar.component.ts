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
goToAssessments() {

  const role = localStorage.getItem('role'); // or from your auth service

  if (role === 'ADMIN') {
    this.router.navigate(['/manage-assessments']);
  } 
  else if (role === 'LEARNER') {
    this.router.navigate(['/assessment']);
  }

}
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
  
  private updateCurrentUser(): void {
    const u = this.auth.getUserFromToken();
  
    if (!u) {
      this.currentUser = { name: '', email: '', avatar: 'https://i.pravatar.cc/150?img=12' };
      return;
    }
  
    this.currentUser.email = u.email;
    // if the token contains first/last name use them, otherwise fall back to email prefix
    if (u.prenom || u.nom) {
      this.currentUser.name = `${u.prenom || ''} ${u.nom || ''}`.trim();
    } else {
      this.currentUser.name = u.email.split('@')[0];
    }
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
  
    this.currentRoute = this.router.url;
  
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.router.url;
        this.updateCurrentUser(); // ✅ refresh user after login redirect
      });
  
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
  onMyCertificatesClick(): void {
 
  this.router.navigate(['/my-certificates']); 
  this.isUserDropdownOpen = false;
}

  onLogout(): void {
    this.auth.logout();                  // remove token
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
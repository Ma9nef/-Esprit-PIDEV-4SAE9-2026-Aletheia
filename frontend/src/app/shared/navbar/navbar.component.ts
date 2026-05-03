import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SubscriptionNotificationService } from '../../core/services/subscription-notification.service';
import { NotificationService, AppNotification } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('userDropdown') userDropdown!: ElementRef<HTMLDivElement>;
  @ViewChild('notificationPanel') notificationPanel!: ElementRef<HTMLDivElement>;

  isMobileMenuOpen = false;
  isUserDropdownOpen = false;
  isNotificationPanelOpen = false;

  unreadNotificationCount = 0;
  unreadCount = 0;
  notifications: AppNotification[] = [];

  searchControl = new FormControl('');
  searchQuery = '';
  currentRoute = '';

  private subs = new Subscription();

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
    public themeService: ThemeService,
    private auth: AuthService,
    private subscriptionNotificationService: SubscriptionNotificationService,
    public notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.updateCurrentUser();
    this.currentRoute = this.router.url;
    this.loadUnreadNotificationCount();

    this.subs.add(
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe(() => {
          this.currentRoute = this.router.url;
          this.updateCurrentUser();
          this.loadUnreadNotificationCount();
        })
    );

    this.subs.add(
      this.searchControl.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(query => {
          this.searchQuery = query || '';
        })
    );

    if (this.isLoggedIn) {
      this.notificationService.startPolling();
    }

    this.subs.add(
      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      })
    );

    this.subs.add(
      this.notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.notificationService.stopPolling();
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get isAdmin(): boolean {
    const user = this.auth.getUserFromToken();
    return !!user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN');
  }

  get isInstructor(): boolean {
    const user = this.auth.getUserFromToken();
    return !!user && (
      user.role === 'INSTRUCTOR' ||
      user.role === 'ROLE_INSTRUCTOR' ||
      user.role === 'TRAINER' ||
      user.role === 'ROLE_TRAINER'
    );
  }

  get isLearner(): boolean {
    const user = this.auth.getUserFromToken();
    return !!user && (user.role === 'LEARNER' || user.role === 'ROLE_LEARNER');
  }

  private updateCurrentUser(): void {
    const user = this.auth.getUserFromToken();

    if (!user) {
      this.currentUser = {
        name: '',
        email: '',
        avatar: 'https://i.pravatar.cc/150?img=12'
      };
      return;
    }

    this.currentUser.email = user.email || '';
    this.currentUser.name = user.email ? user.email.split('@')[0] : 'User';
  }

  onMyCertificatesClick(): void {
    const role = localStorage.getItem('role');

    if (role === 'ADMIN') {
      this.router.navigate(['/manage-certificates']);
    } else if (role === 'LEARNER') {
      this.router.navigate(['/my-certificates']);
    }

    this.isUserDropdownOpen = false;
  }

  goToAssessments(): void {
    const role = localStorage.getItem('role');

    if (role === 'ADMIN') {
      this.router.navigate(['/manage-assessments']);
    } else if (role === 'LEARNER') {
      this.router.navigate(['/assessment']);
    }

    this.isUserDropdownOpen = false;
  }

  goToSubmissions(): void {
    this.router.navigate(['/submissions']);
    this.isUserDropdownOpen = false;
  }

  toggleNotificationPanel(): void {
    this.isNotificationPanelOpen = !this.isNotificationPanelOpen;

    if (this.isNotificationPanelOpen) {
      this.isUserDropdownOpen = false;
      this.notificationService.loadNotifications();
    }
  }

  onMarkAsRead(id: number): void {
    this.notificationService.markAsRead(id);
  }

  onMarkAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  onDeleteNotification(id: number, event: Event): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(id);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'SUCCESS':
        return '✓';
      case 'WARNING':
        return '⚠';
      case 'ERROR':
        return '✕';
      default:
        return 'i';
    }
  }

  formatNotificationTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;

    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;

    const diffD = Math.floor(diffH / 24);
    return `${diffD}d ago`;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as Node;

    if (this.userDropdown && !this.userDropdown.nativeElement.contains(target)) {
      this.isUserDropdownOpen = false;
    }

    if (this.notificationPanel && !this.notificationPanel.nativeElement.contains(target)) {
      this.isNotificationPanelOpen = false;
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
    if (!this.searchQuery.trim()) {
      return;
    }

    this.router.navigate(['/front/courses'], {
      queryParams: { search: this.searchQuery.trim() }
    });

    this.isMobileMenuOpen = false;
  }

  onProfileClick(): void {
    this.router.navigate(['/front/profile']);
    this.isUserDropdownOpen = false;
  }

  onMyCoursesClick(): void {
    this.router.navigate(['/front/my-courses']);
    this.isUserDropdownOpen = false;
  }

  goToSubscriptionNotifications(): void {
    this.router.navigate(['/subscription-notifications']);
    this.isUserDropdownOpen = false;
  }

  onDashboardClick(): void {
    const user = this.auth.getUserFromToken();

    if (!user?.role) {
      this.isUserDropdownOpen = false;
      return;
    }

    const role = user.role.toLowerCase();

    if (role === 'admin' || role === 'role_admin') {
      this.router.navigate(['/dashboardAdmin']);
    } else if (
      role === 'trainer' ||
      role === 'role_trainer' ||
      role === 'instructor' ||
      role === 'role_instructor'
    ) {
      this.router.navigate(['/dashboardInstructor']);
    } else {
      this.router.navigate(['/dashboardLearner']);
    }

    this.isUserDropdownOpen = false;
  }

  onLogout(): void {
    this.auth.logout();

    this.isUserDropdownOpen = false;
    this.isMobileMenuOpen = false;
    this.isNotificationPanelOpen = false;

    this.notificationService.stopPolling();

    this.currentUser = {
      name: '',
      email: '',
      avatar: 'https://i.pravatar.cc/150?img=12'
    };

    this.unreadNotificationCount = 0;
    this.unreadCount = 0;
    this.notifications = [];

    this.router.navigate(['/home']);
  }

  private loadUnreadNotificationCount(): void {
    const user = this.auth.getUserFromToken();

    if (!user?.id) {
      this.unreadNotificationCount = 0;
      return;
    }

    this.subs.add(
      this.subscriptionNotificationService.getUserUnreadCount(String(user.id)).subscribe({
        next: response => {
          this.unreadNotificationCount = response.unreadCount ?? 0;
        },
        error: () => {
          this.unreadNotificationCount = 0;
        }
      })
    );
  }
}
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogMenuService, MenuCategoryDTO, CourseMiniDTO } from 'src/app/core/services/catalog-menu.service';

@Component({
  selector: 'app-explore-mega-menu',
  templateUrl: './explore-mega-menu.component.html',
  styleUrls: ['./explore-mega-menu.component.css']
})
export class ExploreMegaMenuComponent implements OnInit {

  open = false;

  menu: MenuCategoryDTO[] = [];
  activeCategory?: MenuCategoryDTO;
  activeSubCategory?: string;

  topCourses: CourseMiniDTO[] = [];

  loadingMenu = false;
  loadingTop = false;

  // cache: évite de spammer l’API pendant les hover
  private topCache = new Map<string, CourseMiniDTO[]>();

  constructor(
    private api: CatalogMenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // on charge le menu au démarrage pour une ouverture instantanée
    this.loadMenu();
  }
  toggle(): void {
    this.open = !this.open;
  }
  close(): void {
    this.open = false;
  }
  loadMenu(): void {
    this.api.getMenu().subscribe(res => {
      console.log("MENU FROM API:", res);
      this.menu = res;
    });
  }
  setCategory(cat: MenuCategoryDTO): void {
    this.activeCategory = cat;
  
    // ✅ reset subCategory selection (optional)
    this.activeSubCategory = undefined;
  
    // ✅ fetch TOP courses by CATEGORY only (no subCategory)
    this.loadTopByCategoryOnly();
  }
  setSubCategory(sc: string): void {
    this.activeSubCategory = sc;
    this.loadTop();
  }

  private loadTop(): void {
    if (!this.activeCategory) {
      this.topCourses = [];
      return;
    }
  
    const key = `${this.activeCategory.label}::${this.activeSubCategory ?? ''}`;
    const cached = this.topCache.get(key);
    if (cached) {
      this.topCourses = cached;
      return;
    }
  
    this.loadingTop = true;
    this.api.getTop(this.activeCategory.label, this.activeSubCategory, 10).subscribe({
      next: (list) => {
        const safe = list || [];
        this.topCache.set(key, safe);
        this.topCourses = safe;
        this.loadingTop = false;
      },
      error: () => {
        this.topCourses = [];
        this.loadingTop = false;
      }
    });
  }
  
  private loadTopByCategoryOnly(): void {
    if (!this.activeCategory) {
      this.topCourses = [];
      return;
    }
  
    const key = `${this.activeCategory.label}::`; // no subCategory
    const cached = this.topCache.get(key);
    if (cached) {
      this.topCourses = cached;
      return;
    }
  
    this.loadingTop = true;
    this.api.getTop(this.activeCategory.label, undefined, 10).subscribe({
      next: (list) => {
        const safe = list || [];
        this.topCache.set(key, safe);
        this.topCourses = safe;
        this.loadingTop = false;
      },
      error: () => {
        this.topCourses = [];
        this.loadingTop = false;
      }
    });
  }
  goToCourse(courseId: number): void {
    this.close();
    this.router.navigate(['/front/course-details', courseId]);
  }

  viewAll(): void {
    if (!this.activeCategory) return;

    this.close();
    // Page catalogue filtrée (si vous l’avez). Sinon on peut la créer.
    this.router.navigate(['/catalog'], {
      queryParams: {
        category: this.activeCategory.label,
        subCategory: this.activeSubCategory
      }
    });
  }

  // Fermer au clic en dehors
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.open) return;
    const target = ev.target as HTMLElement;
    if (!target.closest('.explore-wrap')) this.close();
  }

  // Fermer avec ESC
  @HostListener('document:keydown.escape')
  onEsc() { this.close(); }
}
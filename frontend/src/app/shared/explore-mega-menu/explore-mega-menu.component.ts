import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CatalogMenuService,
  MenuCategoryDTO,
  CourseMiniDTO
} from 'src/app/core/services/catalog-menu.service';

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

  private topCache = new Map<string, CourseMiniDTO[]>();

  constructor(
    private api: CatalogMenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMenu();
  }

  toggle(): void {
    this.open = !this.open;

    if (this.open && this.menu.length === 0) {
      this.loadMenu();
    }
  }

  openMenu(): void {
    this.open = true;

    if (this.menu.length === 0) {
      this.loadMenu();
    }
  }

  close(): void {
    this.open = false;
  }

  loadMenu(): void {
    this.loadingMenu = true;

    this.api.getMenu().subscribe({
      next: (res) => {
        this.menu = res || [];
        this.loadingMenu = false;

        if (this.menu.length > 0 && !this.activeCategory) {
          this.setCategory(this.menu[0]);
        }
      },
      error: () => {
        this.menu = [];
        this.loadingMenu = false;
      }
    });
  }

  setCategory(cat: MenuCategoryDTO): void {
    this.activeCategory = cat;
    this.activeSubCategory = undefined;
    this.loadTopByCategoryOnly();
  }

  setSubCategory(sc: string): void {
    this.activeSubCategory = sc;
    this.loadTop();
  }

  private getCategoryName(cat?: MenuCategoryDTO): string {
    if (!cat) return '';

    const candidate = cat as any;
    return candidate.label ?? candidate.category ?? '';
  }

  private loadTop(): void {
    const categoryName = this.getCategoryName(this.activeCategory);

    if (!categoryName) {
      this.topCourses = [];
      return;
    }

    const key = `${categoryName}::${this.activeSubCategory ?? ''}`;
    const cached = this.topCache.get(key);

    if (cached) {
      this.topCourses = cached;
      return;
    }

    this.loadingTop = true;

    this.api.getTop(categoryName, this.activeSubCategory, 10).subscribe({
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
    const categoryName = this.getCategoryName(this.activeCategory);

    if (!categoryName) {
      this.topCourses = [];
      return;
    }

    const key = `${categoryName}::`;
    const cached = this.topCache.get(key);

    if (cached) {
      this.topCourses = cached;
      return;
    }

    this.loadingTop = true;

    this.api.getTop(categoryName, undefined, 10).subscribe({
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
    const categoryName = this.getCategoryName(this.activeCategory);
    if (!categoryName) return;

    this.close();
    this.router.navigate(['/catalog'], {
      queryParams: {
        category: categoryName,
        subCategory: this.activeSubCategory
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent): void {
    if (!this.open) return;

    const target = ev.target as HTMLElement;
    if (!target.closest('.explore-wrap')) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.close();
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'aletheia-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly isDarkSubject = new BehaviorSubject<boolean>(this.getInitialTheme());

  /** Emits the current dark mode state. Components can subscribe or use with async pipe. */
  readonly isDark$: Observable<boolean> = this.isDarkSubject.asObservable();

  constructor() {
    this.applyTheme(this.isDarkSubject.value);
  }

  get isDark(): boolean {
    return this.isDarkSubject.value;
  }

  /** Call once at app bootstrap to apply saved theme (service constructor already does this). */
  init(): void {
    this.applyTheme(this.isDarkSubject.value);
  }

  toggleTheme(): void {
    this.setDark(!this.isDarkSubject.value);
  }

  setDark(isDark: boolean): void {
    this.isDarkSubject.next(isDark);
    this.applyTheme(isDark);
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  }

  setTheme(theme: Theme): void {
    this.setDark(theme === 'dark');
  }

  private getInitialTheme(): boolean {
    if (typeof localStorage === 'undefined') return true; // SSR-safe default
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return true; // default to dark to match current design
  }

  private applyTheme(isDark: boolean): void {
    if (typeof document === 'undefined' || !document.body) return;
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}

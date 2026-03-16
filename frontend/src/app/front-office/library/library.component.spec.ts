import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryComponent } from './library.component';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load library resources on init', () => {
    expect(component.libraryResources.length).toBeGreaterThan(0);
  });

  it('should filter resources by search query', () => {
    component.onSearchChange('java');
    expect(component.filteredResources.length).toBeGreaterThan(0);
  });

  it('should filter resources by category', () => {
    component.onCategoryChange('java');
    expect(component.filteredResources.every(r => r.category === 'java')).toBeTruthy();
  });
});


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainerCoursesComponent } from './trainer-courses.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';

describe('TrainerCoursesComponent', () => {
  let component: TrainerCoursesComponent;
  let fixture: ComponentFixture<TrainerCoursesComponent>;
  let httpMock: HttpTestingController;

  const API = '/api/instructor/dashboard/courses';

  beforeEach(async () => {
    localStorage.setItem('token', 'fake-token');

    await TestBed.configureTestingModule({
      declarations: [TrainerCoursesComponent],
      imports: [HttpClientTestingModule, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainerCoursesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('token');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load courses successfully on init', () => {
    const mockCourses = [
      {
        courseId: 1,
        title: 'Java Basics',
        enrollments: 12,
        archived: false
      },
      {
        courseId: 2,
        title: 'Spring Boot',
        enrollments: 8,
        archived: true
      }
    ];

    fixture.detectChanges(); // triggers ngOnInit

    const req = httpMock.expectOne(API);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(mockCourses);

    expect(component.courses).toEqual(mockCourses);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should set empty array when API returns null or empty fallback', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(API);
    req.flush(null);

    expect(component.courses).toEqual([]);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should set error when request fails', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(API);
    req.flush('error', { status: 500, statusText: 'Server Error' });

    expect(component.error).toBe('Failed to load trainer courses');
    expect(component.loading).toBeFalse();
    expect(component.courses).toEqual([]);
  });

  it('should send empty Authorization header if token does not exist', () => {
    localStorage.removeItem('token');

    fixture = TestBed.createComponent(TrainerCoursesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const req = httpMock.expectOne(API);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('');

    req.flush([]);

    expect(component.courses).toEqual([]);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  });
});
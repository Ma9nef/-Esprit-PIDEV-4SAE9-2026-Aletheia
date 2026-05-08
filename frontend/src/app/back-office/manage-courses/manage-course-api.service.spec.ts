import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InstructorCourseApiService, CourseAdminDTO, CourseCreateDTO, CourseUpdateDTO } from './instructor-course-api.service';

describe('InstructorCourseApiService', () => {
  let service: InstructorCourseApiService;
  let httpMock: HttpTestingController;

  const API = '/api/instructor/courses';

  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InstructorCourseApiService]
    });

    service = TestBed.inject(InstructorCourseApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list instructor courses', () => {
    const mockCourses: CourseAdminDTO[] = [
      {
        id: 1,
        title: 'Java Basics',
        description: 'Intro to Java',
        price: 100,
        durationHours: 20,
        archived: false,
        createdAt: '2026-04-16T10:00:00',
        updatedAt: '2026-04-16T12:00:00'
      },
      {
        id: 2,
        title: 'Spring Boot',
        description: 'REST APIs with Spring',
        price: 150,
        durationHours: 25,
        archived: true,
        createdAt: '2026-04-15T10:00:00',
        updatedAt: '2026-04-15T12:00:00'
      }
    ];

    service.listMine().subscribe((courses) => {
      expect(courses.length).toBe(2);
      expect(courses).toEqual(mockCourses);
    });

    const req = httpMock.expectOne(API);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(mockCourses);
  });

  it('should create a course', () => {
    const payload: CourseCreateDTO = {
      title: 'Angular Advanced',
      description: 'Deep dive into Angular',
      price: 200,
      durationHours: 30
    };

    const mockResponse: CourseAdminDTO = {
      id: 3,
      ...payload,
      archived: false,
      createdAt: '2026-04-16T14:00:00',
      updatedAt: '2026-04-16T14:00:00'
    };

    service.create(payload).subscribe((course) => {
      expect(course).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(API);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(mockResponse);
  });

  it('should update a course', () => {
    const courseId = 1;

    const payload: CourseUpdateDTO = {
      title: 'Angular Updated',
      description: 'Updated description',
      price: 250,
      durationHours: 35
    };

    const mockResponse: CourseAdminDTO = {
      id: courseId,
      ...payload,
      archived: false,
      createdAt: '2026-04-16T10:00:00',
      updatedAt: '2026-04-16T15:00:00'
    };

    service.update(courseId, payload).subscribe((course) => {
      expect(course).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${API}/${courseId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(mockResponse);
  });

  it('should delete a course', () => {
    const courseId = 5;

    service.delete(courseId).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${API}/${courseId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(null);
  });

  it('should not set Authorization header when token does not exist', () => {
    localStorage.removeItem('token');

    service.listMine().subscribe();

    const req = httpMock.expectOne(API);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush([]);
  });
});
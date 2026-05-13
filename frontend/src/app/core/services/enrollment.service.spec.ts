import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EnrollmentService } from './enrollment.service';

describe('EnrollmentService', () => {
  let service: EnrollmentService;
  let httpMock: HttpTestingController;

  const API = 'http://localhost:8081/course/public/enrollments';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EnrollmentService]
    });

    service = TestBed.inject(EnrollmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should enroll in a course', () => {
    const mockResponse = {
      id: 1,
      courseId: 5,
      status: 'ENROLLED'
    };

    service.enroll(5).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${API}/5`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});

    req.flush(mockResponse);
  });

  it('should get all enrollments', () => {
    const mockResponse = [
      { id: 1, courseId: 5, status: 'ENROLLED' },
      { id: 2, courseId: 8, status: 'COMPLETED' }
    ];

    service.getAllEnrollments().subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.length).toBe(2);
    });

    const req = httpMock.expectOne(API);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should get my enrollments', () => {
    const mockResponse = [
      { id: 10, courseId: 3, status: 'ENROLLED' },
      { id: 11, courseId: 7, status: 'COMPLETED' }
    ];

    service.myEnrollments().subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res[0].courseId).toBe(3);
    });

    const req = httpMock.expectOne(`${API}/me`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should handle empty enrollments list', () => {
    service.getAllEnrollments().subscribe(res => {
      expect(res).toEqual([]);
    });

    const req = httpMock.expectOne(API);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should handle enroll API error', () => {
    service.enroll(99).subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`${API}/99`);
    expect(req.request.method).toBe('POST');

    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
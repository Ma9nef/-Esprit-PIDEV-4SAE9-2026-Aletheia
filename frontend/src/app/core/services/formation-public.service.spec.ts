import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FormationPublicService } from './formation-public.service';
import { Formation } from '../models/formation.model';
import { FormationEnrollment } from '../models/formation-enrollment.model';
import { MyEnrolledFormation } from '../models/my-enrolled-formation.model';
import { FormationSession } from '../models/formation-session.model';
import { FormationAttendanceSummary } from '../models/formation-attendance.model';

describe('FormationPublicService', () => {
  let service: FormationPublicService;
  let httpMock: HttpTestingController;

  const API = '/api/formations';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FormationPublicService]
    });

    service = TestBed.inject(FormationPublicService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all formations', () => {
    const mockFormations: Formation[] = [
      {
        id: 1,
        title: 'Java Basics'
      } as Formation,
      {
        id: 2,
        title: 'Spring Boot'
      } as Formation
    ];

    service.getAllFormations().subscribe(res => {
      expect(res).toEqual(mockFormations);
      expect(res.length).toBe(2);
    });

    const req = httpMock.expectOne(API);
    expect(req.request.method).toBe('GET');

    req.flush(mockFormations);
  });

  it('should get formation by id', () => {
    const mockFormation: Formation = {
      id: 5,
      title: 'Angular Advanced'
    } as Formation;

    service.getFormationById(5).subscribe(res => {
      expect(res).toEqual(mockFormation);
      expect(res.id).toBe(5);
    });

    const req = httpMock.expectOne(`${API}/5`);
    expect(req.request.method).toBe('GET');

    req.flush(mockFormation);
  });

  it('should enroll in formation', () => {
    const mockEnrollment: FormationEnrollment = {
      id: 10
    } as FormationEnrollment;

    service.enrollInFormation(3).subscribe(res => {
      expect(res).toEqual(mockEnrollment);
    });

    const req = httpMock.expectOne(`${API}/3/enroll`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();

    req.flush(mockEnrollment);
  });

  it('should get my enrolled formations', () => {
    const mockEnrolled: MyEnrolledFormation[] = [
      {
        formationId: 1,
        title: 'Java Basics'
      } as MyEnrolledFormation,
      {
        formationId: 2,
        title: 'Spring Boot'
      } as MyEnrolledFormation
    ];

    service.getMyEnrolledFormations().subscribe(res => {
      expect(res).toEqual(mockEnrolled);
      expect(res.length).toBe(2);
    });

    const req = httpMock.expectOne(`${API}/my-enrollments`);
    expect(req.request.method).toBe('GET');

    req.flush(mockEnrolled);
  });

  it('should get formation sessions', () => {
    const mockSessions: FormationSession[] = [
      {
        id: 1
      } as FormationSession,
      {
        id: 2
      } as FormationSession
    ];

    service.getFormationSessions(7).subscribe(res => {
      expect(res).toEqual(mockSessions);
      expect(res.length).toBe(2);
    });

    const req = httpMock.expectOne(`${API}/7/sessions`);
    expect(req.request.method).toBe('GET');

    req.flush(mockSessions);
  });

  it('should get my attendance', () => {
    const mockAttendance: FormationAttendanceSummary = {
      presentCount: 4,
      absentCount: 1
    } as FormationAttendanceSummary;

    service.getMyAttendance(8).subscribe(res => {
      expect(res).toEqual(mockAttendance);
      expect(res.presentCount).toBe(4);
    });

    const req = httpMock.expectOne(`${API}/8/attendance/me`);
    expect(req.request.method).toBe('GET');

    req.flush(mockAttendance);
  });

  it('should handle empty formations list', () => {
    service.getAllFormations().subscribe(res => {
      expect(res).toEqual([]);
    });

    const req = httpMock.expectOne(API);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should handle formation by id error', () => {
    service.getFormationById(999).subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`${API}/999`);
    expect(req.request.method).toBe('GET');

    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
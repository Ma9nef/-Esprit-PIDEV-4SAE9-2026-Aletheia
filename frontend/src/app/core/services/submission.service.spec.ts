import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SubmissionService } from './submission.service';
import { Submission } from '../models/Submission.model';

describe('SubmissionService', () => {
  let service: SubmissionService;
  let httpMock: HttpTestingController;

  const API = 'http://localhost:8089/api/assessment-results';

  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SubmissionService]
    });

    service = TestBed.inject(SubmissionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all submissions with auth header', () => {
    const mockSubmissions: Submission[] = [
      {
        id: 1,
        submittedAt: '2026-04-16T10:00:00',
        status: 'GRADED',
        score: 85,
        feedback: 'Réussi',
        user: {
          id: 1,
          nom: 'Ben Salah',
          prenom: 'Ali'
        }
      }
    ];

    service.getAllSubmissions().subscribe(res => {
      expect(res).toEqual(mockSubmissions);
    });

    const req = httpMock.expectOne(`${API}/all`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(mockSubmissions);
  });

  it('should delete submission with auth header', () => {
    service.deleteSubmission(5).subscribe(res => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne(`${API}/delete/5`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush({});
  });

  it('should send Bearer null if token is missing', () => {
    localStorage.removeItem('token');

    service.getAllSubmissions().subscribe();

    const req = httpMock.expectOne(`${API}/all`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer null');

    req.flush([]);
  });
});
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AssessmentService } from './assessment.service';
import { Assessment } from '../models/assessment.model';

describe('AssessmentService', () => {
  let service: AssessmentService;
  let httpMock: HttpTestingController;

  const ASSESSMENT_API = 'http://localhost:8089/pidev/assessments';
  const SUBMISSION_API = 'http://localhost:8089/api/assessment-results';

  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AssessmentService]
    });

    service = TestBed.inject(AssessmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save assessment result', () => {
    const payload = { assessmentId: 1, score: 80 };
    const mockResponse = { message: 'saved' };

    service.saveAssessmentResult(payload).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(SUBMISSION_API);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(mockResponse);
  });

  it('should get all assessments', () => {
    const mockAssessments: Assessment[] = [
      { id: 1 } as Assessment,
      { id: 2 } as Assessment
    ];

    service.getAllAssessments().subscribe(res => {
      expect(res).toEqual(mockAssessments);
    });

    const req = httpMock.expectOne(`${ASSESSMENT_API}/all`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(mockAssessments);
  });

  it('should get assessment by id', () => {
    const mockAssessment: Assessment = { id: 7 } as Assessment;

    service.getAssessmentById(7).subscribe(res => {
      expect(res).toEqual(mockAssessment);
    });

    const req = httpMock.expectOne(`${ASSESSMENT_API}/get/7`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(mockAssessment);
  });

  it('should create assessment', () => {
    const payload = { title: 'Quiz 1' };
    const mockAssessment: Assessment = { id: 3 } as Assessment;

    service.createAssessment(payload).subscribe(res => {
      expect(res).toEqual(mockAssessment);
    });

    const req = httpMock.expectOne(`${ASSESSMENT_API}/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(mockAssessment);
  });

  it('should update assessment', () => {
    const payload = { title: 'Updated Quiz' };
    const mockAssessment: Assessment = { id: 4 } as Assessment;

    service.updateAssessment(4, payload).subscribe(res => {
      expect(res).toEqual(mockAssessment);
    });

    const req = httpMock.expectOne(`${ASSESSMENT_API}/update/4`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(mockAssessment);
  });

  it('should delete assessment', () => {
    service.deleteAssessment(9).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${ASSESSMENT_API}/delete/9`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(null);
  });

  it('should submit quiz', () => {
    const answers = { q1: 'A', q2: 'B' };
    const mockResponse = { score: 90 };

    service.submitQuiz(11, answers).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${ASSESSMENT_API}/11/submit`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(answers);
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(mockResponse);
  });
});
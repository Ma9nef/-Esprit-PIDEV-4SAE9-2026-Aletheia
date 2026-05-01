import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuestionService } from './question.service';
import { Question } from '../models/question.model';

describe('QuestionService', () => {
  let service: QuestionService;
  let httpMock: HttpTestingController;

  const API = 'http://localhost:8081/pidev/questions';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuestionService]
    });

    service = TestBed.inject(QuestionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add question to assessment', () => {
    const question: Question = {
      id: 1
    } as Question;

    service.addQuestion(5, question).subscribe(res => {
      expect(res).toEqual(question);
    });

    const req = httpMock.expectOne(`${API}/add-to-assessment/5`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(question);

    req.flush(question);
  });

  it('should get questions by assessment', () => {
    const questions: Question[] = [
      { id: 1 } as Question,
      { id: 2 } as Question
    ];

    service.getQuestionsByAssessment(8).subscribe(res => {
      expect(res).toEqual(questions);
    });

    const req = httpMock.expectOne(`${API}/assessment/8`);
    expect(req.request.method).toBe('GET');

    req.flush(questions);
  });

  it('should update question', () => {
    const question: Question = {
      id: 3
    } as Question;

    service.updateQuestion(3, question).subscribe(res => {
      expect(res).toEqual(question);
    });

    const req = httpMock.expectOne(`${API}/3`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(question);

    req.flush(question);
  });

  it('should delete question', () => {
    service.deleteQuestion(4).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${API}/4`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LoanService } from './loan.service';

describe('LoanService', () => {
  let service: LoanService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(LoanService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call borrow endpoint with request body', () => {
    service.borrow(7, 99).subscribe();

    const req = httpMock.expectOne('/api/loans/borrow');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ userId: 7, productId: 99 });
    req.flush({ id: 1 });
  });

  it('should call return endpoint with userId query param', () => {
    service.returnItem(55, 7).subscribe();

    const req = httpMock.expectOne(r => r.url === '/api/loans/55/return' && r.params.get('userId') === '7');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 55, status: 'RETURNED' });
  });

  it('should call update policy endpoint and propagate backend errors', () => {
    let statusCode: number | undefined;
    service.updatePolicy(3, {
      id: 3,
      userRole: 'LEARNER',
      maxActiveBorrows: 0,
      loanDurationDays: 14,
      fineRatePerDay: 0.5,
      maxFineBlockThreshold: 10,
      restrictedProductTypes: ['PDF']
    }).subscribe({
      next: () => fail('expected error'),
      error: err => statusCode = err.status
    });

    const req = httpMock.expectOne('/api/policies/3');
    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'bad request' }, { status: 400, statusText: 'Bad Request' });

    expect(statusCode).toBe(400);
  });
});


import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type LoanStatus = 'ACTIVE' | 'OVERDUE' | 'RETURNED';
export type ProductType = 'BOOK' | 'CHILDREN_MATERIAL' | 'PDF' | 'EXAM' | 'OTHER';
export type UserRole = 'LEARNER' | 'INSTRUCTOR' | 'ADMIN';

export interface LoanDTO {
  id: number;
  userId: number;
  userRole: string;
  productId: number;
  productTitle: string;
  productAuthor: string;
  productType: ProductType;
  productCoverImageUrl: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: LoanStatus;
  fineAmount: number;
  finePaid: boolean;
  daysOverdue: number;
  createdAt: string;
}

export interface BorrowingPolicyDTO {
  id: number;
  userRole: UserRole;
  maxActiveBorrows: number;
  loanDurationDays: number;
  fineRatePerDay: number;
  maxFineBlockThreshold: number;
  restrictedProductTypes: ProductType[];
}

@Injectable({ providedIn: 'root' })
export class LoanService {
  private readonly loansBase = '/api/loans';
  private readonly policiesBase = '/api/policies';

  constructor(private http: HttpClient) {}

  // ── Borrowing ──────────────────────────────────────────────────────────────

  borrow(userId: number, productId: number): Observable<LoanDTO> {
    return this.http.post<LoanDTO>(`${this.loansBase}/borrow`, { userId, productId });
  }

  returnItem(loanId: number, userId: number): Observable<LoanDTO> {
    return this.http.post<LoanDTO>(
      `${this.loansBase}/${loanId}/return`,
      null,
      { params: new HttpParams().set('userId', userId) }
    );
  }

  payFine(loanId: number, userId: number): Observable<LoanDTO> {
    return this.http.post<LoanDTO>(
      `${this.loansBase}/${loanId}/pay-fine`,
      null,
      { params: new HttpParams().set('userId', userId) }
    );
  }

  // ── Read ──────────────────────────────────────────────────────────────────

  getLoansByUser(userId: number): Observable<LoanDTO[]> {
    return this.http.get<LoanDTO[]>(`${this.loansBase}/user/${userId}`);
  }

  getActiveLoansByUser(userId: number): Observable<LoanDTO[]> {
    return this.http.get<LoanDTO[]>(`${this.loansBase}/user/${userId}/active`);
  }

  getAllLoans(): Observable<LoanDTO[]> {
    return this.http.get<LoanDTO[]>(this.loansBase);
  }

  getOverdueLoans(): Observable<LoanDTO[]> {
    return this.http.get<LoanDTO[]>(`${this.loansBase}/overdue`);
  }

  // ── Policies ──────────────────────────────────────────────────────────────

  getAllPolicies(): Observable<BorrowingPolicyDTO[]> {
    return this.http.get<BorrowingPolicyDTO[]>(this.policiesBase);
  }

  updatePolicy(id: number, policy: BorrowingPolicyDTO): Observable<BorrowingPolicyDTO> {
    return this.http.put<BorrowingPolicyDTO>(`${this.policiesBase}/${id}`, policy);
  }
}

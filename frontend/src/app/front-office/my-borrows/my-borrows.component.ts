import { Component, OnInit } from '@angular/core';
import { LoanDTO, LoanService } from '../../core/services/loan.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-my-borrows',
  templateUrl: './my-borrows.component.html',
  styleUrls: ['./my-borrows.component.css']
})
export class MyBorrowsComponent implements OnInit {
  loans: LoanDTO[] = [];
  loading = false;
  error = '';
  successMsg = '';
  userId: number | null = null;
  activeTab: 'active' | 'all' = 'active';

  // Return confirm modal
  pendingReturnLoan: LoanDTO | null = null;
  returning = false;

  constructor(
    private loanService: LoanService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserFromToken();
    if (user) {
      this.userId = user.id;
      this.load();
    } else {
      this.error = 'You must be logged in to view your loans.';
    }
  }

  load(): void {
    if (!this.userId) return;
    this.loading = true;
    this.error = '';
    this.loanService.getLoansByUser(this.userId).subscribe({
      next: (data) => { this.loans = data; this.loading = false; },
      error: () => { this.error = 'Failed to load your loans.'; this.loading = false; }
    });
  }

  get activeCount(): number {
    return this.loans.filter(l => l.status === 'ACTIVE' || l.status === 'OVERDUE').length;
  }

  get displayedLoans(): LoanDTO[] {
    if (this.activeTab === 'active') {
      return this.loans.filter(l => l.status === 'ACTIVE' || l.status === 'OVERDUE');
    }
    return this.loans;
  }

  confirmReturn(loan: LoanDTO): void {
    this.pendingReturnLoan = loan;
  }

  cancelReturn(): void {
    this.pendingReturnLoan = null;
  }

  executeReturn(): void {
    if (!this.pendingReturnLoan || !this.userId) return;
    this.returning = true;
    this.loanService.returnItem(this.pendingReturnLoan.id, this.userId).subscribe({
      next: (updated) => {
        const idx = this.loans.findIndex(l => l.id === updated.id);
        if (idx >= 0) this.loans[idx] = updated;
        this.pendingReturnLoan = null;
        this.returning = false;
        this.successMsg = updated.fineAmount > 0
          ? `Returned. A fine of $${updated.fineAmount.toFixed(2)} has been applied.`
          : 'Returned successfully. No fine incurred.';
        setTimeout(() => this.successMsg = '', 4000);
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to process return.';
        this.pendingReturnLoan = null;
        this.returning = false;
      }
    });
  }

  payFine(loan: LoanDTO): void {
    if (!this.userId) return;
    this.loanService.payFine(loan.id, this.userId).subscribe({
      next: (updated) => {
        const idx = this.loans.findIndex(l => l.id === updated.id);
        if (idx >= 0) this.loans[idx] = updated;
        this.successMsg = 'Fine paid successfully.';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.error = 'Failed to process fine payment.'; }
    });
  }

  statusClass(status: string): string {
    return { ACTIVE: 'status-active', OVERDUE: 'status-overdue', RETURNED: 'status-returned' }[status] ?? '';
  }
}

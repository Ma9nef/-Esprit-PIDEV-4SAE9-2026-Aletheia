import { Component, OnInit } from '@angular/core';
import { LoanDTO, LoanService, LoanStatus } from '../../core/services/loan.service';

@Component({
  selector: 'app-manage-loans',
  templateUrl: './manage-loans.component.html',
  styleUrls: ['./manage-loans.component.css']
})
export class ManageLoansComponent implements OnInit {
  loans: LoanDTO[] = [];
  filtered: LoanDTO[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  statusFilter: LoanStatus | 'ALL' = 'ALL';
  readonly statuses: Array<LoanStatus | 'ALL'> = ['ALL', 'ACTIVE', 'OVERDUE', 'RETURNED'];

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.loanService.getAllLoans().subscribe({
      next: (data) => {
        this.loans = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        const status = err?.status;
        if (status === 401 || status === 403) {
          this.error = 'Access denied (HTTP ' + status + '). Please log in as an admin.';
        } else if (status === 0) {
          this.error = 'Cannot reach the Library service. Make sure it is running.';
        } else {
          this.error = 'Failed to load loans (HTTP ' + (status || 'unknown') + '). Check the Library service logs.';
        }
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.loans];
    if (this.statusFilter !== 'ALL') {
      result = result.filter(l => l.status === this.statusFilter);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(l =>
        l.productTitle.toLowerCase().includes(term) ||
        String(l.userId).includes(term)
      );
    }
    this.filtered = result;
  }

  countByStatus(status: LoanStatus): number {
    return this.loans.filter(l => l.status === status).length;
  }

  statusBadgeClass(status: LoanStatus): string {
    return { ACTIVE: 'badge-active', OVERDUE: 'badge-overdue', RETURNED: 'badge-returned' }[status] ?? '';
  }

  statusIcon(status: LoanStatus): string {
    return { ACTIVE: '📖', OVERDUE: '⚠️', RETURNED: '✅' }[status] ?? '';
  }
}

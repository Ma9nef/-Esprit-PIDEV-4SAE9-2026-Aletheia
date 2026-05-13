import { Component, OnInit } from '@angular/core';
import { BorrowingPolicyDTO, LoanService, ProductType, UserRole } from '../../core/services/loan.service';

@Component({
  selector: 'app-borrowing-policies',
  templateUrl: './borrowing-policies.component.html',
  styleUrls: ['./borrowing-policies.component.css']
})
export class BorrowingPoliciesComponent implements OnInit {
  policies: BorrowingPolicyDTO[] = [];
  loading = false;
  error = '';
  editingPolicy: BorrowingPolicyDTO | null = null;
  saving = false;
  saveError = '';
  saveSuccess = '';

  readonly allProductTypes: ProductType[] = ['BOOK', 'CHILDREN_MATERIAL', 'PDF', 'EXAM', 'OTHER'];
  readonly roleColors: Record<UserRole, string> = {
    LEARNER: '#3b82f6',
    INSTRUCTOR: '#8b5cf6',
    ADMIN: '#059669'
  };
  readonly roleIcons: Record<UserRole, string> = {
    LEARNER: '🎓',
    INSTRUCTOR: '👨‍🏫',
    ADMIN: '🛡️'
  };

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.loanService.getAllPolicies().subscribe({
      next: (data) => { this.policies = data; this.loading = false; },
      error: (err) => {
        const status = err?.status;
        if (status === 401 || status === 403) {
          this.error = 'Access denied (HTTP ' + status + '). Please log in as an admin.';
        } else if (status === 0) {
          this.error = 'Cannot reach the Library service. Make sure it is running.';
        } else {
          this.error = 'Failed to load policies (HTTP ' + (status || 'unknown') + ').';
        }
        this.loading = false;
      }
    });
  }

  startEdit(policy: BorrowingPolicyDTO): void {
    this.editingPolicy = { ...policy, restrictedProductTypes: [...(policy.restrictedProductTypes ?? [])] };
    this.saveError = '';
    this.saveSuccess = '';
  }

  cancelEdit(): void { this.editingPolicy = null; }

  isRestricted(type: ProductType): boolean {
    return this.editingPolicy?.restrictedProductTypes?.includes(type) ?? false;
  }

  toggleRestriction(type: ProductType): void {
    if (!this.editingPolicy) return;
    const list = this.editingPolicy.restrictedProductTypes ?? [];
    if (list.includes(type)) {
      this.editingPolicy.restrictedProductTypes = list.filter(t => t !== type);
    } else {
      this.editingPolicy.restrictedProductTypes = [...list, type];
    }
  }

  save(): void {
    if (!this.editingPolicy) return;
    this.saving = true;
    this.saveError = '';
    this.loanService.updatePolicy(this.editingPolicy.id, this.editingPolicy).subscribe({
      next: (updated) => {
        const idx = this.policies.findIndex(p => p.id === updated.id);
        if (idx >= 0) this.policies[idx] = updated;
        this.saving = false;
        this.saveSuccess = 'Policy saved successfully.';
        setTimeout(() => { this.editingPolicy = null; this.saveSuccess = ''; }, 1400);
      },
      error: () => { this.saveError = 'Failed to save.'; this.saving = false; }
    });
  }
}

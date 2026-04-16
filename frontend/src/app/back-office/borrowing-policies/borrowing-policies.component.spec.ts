import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { BorrowingPoliciesComponent } from './borrowing-policies.component';
import { BorrowingPolicyDTO, LoanService } from '../../core/services/loan.service';

describe('BorrowingPoliciesComponent', () => {
  let component: BorrowingPoliciesComponent;
  let fixture: ComponentFixture<BorrowingPoliciesComponent>;
  let loanSpy: jasmine.SpyObj<LoanService>;

  const learnerPolicy: BorrowingPolicyDTO = {
    id: 1,
    userRole: 'LEARNER',
    maxActiveBorrows: 3,
    loanDurationDays: 21,
    fineRatePerDay: 1.5,
    maxFineBlockThreshold: 20,
    restrictedProductTypes: ['EXAM']
  };

  beforeEach(async () => {
    loanSpy = jasmine.createSpyObj<LoanService>('LoanService', ['getAllPolicies', 'updatePolicy']);
    loanSpy.getAllPolicies.and.returnValue(of([learnerPolicy]));
    loanSpy.updatePolicy.and.returnValue(of(learnerPolicy));

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [BorrowingPoliciesComponent],
      providers: [{ provide: LoanService, useValue: loanSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(BorrowingPoliciesComponent);
    component = fixture.componentInstance;
  });

  it('should load policies on init', () => {
    fixture.detectChanges();

    expect(loanSpy.getAllPolicies).toHaveBeenCalled();
    expect(component.policies.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('should map unauthorized error to access denied message', () => {
    loanSpy.getAllPolicies.and.returnValue(throwError(() => ({ status: 403 })));
    fixture.detectChanges();

    expect(component.error).toContain('Access denied');
    expect(component.loading).toBeFalse();
  });

  it('should map offline error to service unreachable message', () => {
    loanSpy.getAllPolicies.and.returnValue(throwError(() => ({ status: 0 })));
    fixture.detectChanges();

    expect(component.error).toContain('Cannot reach the Library service');
  });

  it('should toggle restriction values while editing', () => {
    fixture.detectChanges();
    component.startEdit(learnerPolicy);

    component.toggleRestriction('PDF');
    expect(component.editingPolicy?.restrictedProductTypes).toContain('PDF');

    component.toggleRestriction('EXAM');
    expect(component.editingPolicy?.restrictedProductTypes).not.toContain('EXAM');
  });

  it('should save updated policy and close edit mode after timeout', fakeAsync(() => {
    fixture.detectChanges();
    component.startEdit(learnerPolicy);
    component.editingPolicy!.maxActiveBorrows = 5;
    loanSpy.updatePolicy.and.returnValue(of({ ...learnerPolicy, maxActiveBorrows: 5 }));

    component.save();

    expect(loanSpy.updatePolicy).toHaveBeenCalledWith(1, jasmine.objectContaining({ maxActiveBorrows: 5 }));
    expect(component.saveSuccess).toContain('saved successfully');
    expect(component.policies[0].maxActiveBorrows).toBe(5);

    tick(1400);
    expect(component.editingPolicy).toBeNull();
    expect(component.saveSuccess).toBe('');
    expect(component.saving).toBeFalse();
  }));

  it('should expose save error when update fails', () => {
    fixture.detectChanges();
    component.startEdit(learnerPolicy);
    loanSpy.updatePolicy.and.returnValue(throwError(() => ({ status: 500 })));

    component.save();

    expect(component.saveError).toBe('Failed to save.');
    expect(component.saving).toBeFalse();
  });
});


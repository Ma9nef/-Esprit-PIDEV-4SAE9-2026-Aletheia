import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { LibraryComponent } from './library.component';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { LoanService } from '../../core/services/loan.service';
import { NotificationService } from '../../core/services/notification.service';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  let httpMock: HttpTestingController;

  let authSpy: jasmine.SpyObj<AuthService>;
  let cartSpy: jasmine.SpyObj<CartService>;
  let loanSpy: jasmine.SpyObj<LoanService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  function flushProducts(payload: any[]): void {
    const req = httpMock.expectOne('/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(payload);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUserFromToken']);
    cartSpy = jasmine.createSpyObj<CartService>('CartService', ['getCart', 'addToCart', 'removeItem', 'clearCart', 'checkout']);
    loanSpy = jasmine.createSpyObj<LoanService>('LoanService', ['getActiveLoansByUser', 'borrow']);
    notificationSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['refreshUnreadCount', 'loadNotifications']);

    authSpy.getUserFromToken.and.returnValue({ id: 1, email: 'learner@test.com', role: 'LEARNER' } as any);
    cartSpy.getCart.and.returnValue(of({ id: 1, userId: 1, checkedOut: false, items: [] } as any));
    loanSpy.getActiveLoansByUser.and.returnValue(of([]));
    loanSpy.borrow.and.returnValue(of({ dueDate: '2026-04-30' } as any));
    cartSpy.checkout.and.returnValue(of({ id: 9, items: [] } as any));
    cartSpy.addToCart.and.returnValue(of({ id: 1, userId: 1, checkedOut: false, items: [] } as any));
    cartSpy.removeItem.and.returnValue(of({ id: 1, userId: 1, checkedOut: false, items: [] } as any));
    cartSpy.clearCart.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      declarations: [LibraryComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: CartService, useValue: cartSpy },
        { provide: LoanService, useValue: loanSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fallback to mock data when products API fails', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('/api/products');
    req.flush({ message: 'boom' }, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(component.error).toContain('Failed to load resources');
    expect(component.libraryResources.length).toBeGreaterThan(0);
  });

  it('should filter by search + category + type', () => {
    fixture.detectChanges();
    flushProducts([
      { id: 1, title: 'Java Basics', description: 'Course', type: 'BOOK', stockQuantity: 2 },
      { id: 2, title: 'Docker Notes', description: 'Guide', type: 'PDF', stockQuantity: 2 }
    ]);

    component.onSearchChange('java');
    component.onCategoryChange('book');
    component.onResourceTypeChange('book');

    expect(component.filteredResources.length).toBe(1);
    expect(component.filteredResources[0].title).toBe('Java Basics');
  });

  it('should block borrow action when user is not authenticated', () => {
    fixture.detectChanges();
    flushProducts([{ id: 10, title: 'Test Book', description: 'desc', type: 'BOOK', stockQuantity: 1 }]);

    component.userId = null;
    component.borrowProduct(component.filteredResources[0]);

    expect(loanSpy.borrow).not.toHaveBeenCalled();
    expect(component.borrowToast?.type).toBe('error');
    expect(component.borrowToast?.message).toContain('Please log in');
  });

  it('should mark item borrowed and decrement stock on successful borrow', () => {
    fixture.detectChanges();
    flushProducts([{ id: 12, title: 'Refactoring', description: 'desc', type: 'BOOK', stockQuantity: 1 }]);

    const resource = component.filteredResources[0];
    component.borrowProduct(resource);

    expect(loanSpy.borrow).toHaveBeenCalledWith(1, 12);
    expect(component.isAlreadyBorrowed(12)).toBeTrue();
    expect(resource.stockQuantity).toBe(0);
    expect(component.borrowToast?.type).toBe('success');
  });

  it('should complete checkout workflow and refresh notifications', () => {
    fixture.detectChanges();
    flushProducts([{ id: 1, title: 'A', description: 'd', type: 'BOOK', stockQuantity: 1 }]);

    component.userId = 1;
    component.checkout();

    expect(cartSpy.checkout).toHaveBeenCalledWith(1);
    expect(component.checkoutSuccess).toBeTrue();
    expect(notificationSpy.refreshUnreadCount).toHaveBeenCalled();
    expect(notificationSpy.loadNotifications).toHaveBeenCalled();
  });

  it('should render out-of-stock state for unavailable item', () => {
    fixture.detectChanges();
    flushProducts([{ id: 2, title: 'No Stock', description: 'd', type: 'BOOK', stockQuantity: 0 }]);

    const nativeElement: HTMLElement = fixture.nativeElement;
    const outOfStockButton = nativeElement.querySelector('.btn-out-stock');

    expect(outOfStockButton).toBeTruthy();
    expect(outOfStockButton?.textContent).toContain('Out of Stock');
  });

  it('should show borrow error toast when borrow API fails', () => {
    loanSpy.borrow.and.returnValue(throwError(() => ({ error: { message: 'Quota exceeded' } })));
    fixture.detectChanges();
    flushProducts([{ id: 3, title: 'Borrow Test', description: 'd', type: 'BOOK', stockQuantity: 2 }]);

    component.borrowProduct(component.filteredResources[0]);

    expect(component.borrowToast?.type).toBe('error');
    expect(component.borrowToast?.message).toContain('Quota exceeded');
  });
});


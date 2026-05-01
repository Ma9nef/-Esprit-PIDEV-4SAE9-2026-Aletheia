import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add to cart with encoded query params', () => {
    service.addToCart(1, 22, 3).subscribe();

    const req = httpMock.expectOne('/api/cart/items?userId=1&productId=22&quantity=3');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({ id: 1, items: [] });
  });

  it('should checkout via orders endpoint', () => {
    service.checkout(77).subscribe();

    const req = httpMock.expectOne('/api/orders/checkout?userId=77');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 10, userId: 77, items: [] });
  });

  it('should propagate checkout failure to caller', () => {
    let receivedMessage = '';
    service.checkout(2).subscribe({
      next: () => fail('expected error'),
      error: err => receivedMessage = err.error?.message
    });

    const req = httpMock.expectOne('/api/orders/checkout?userId=2');
    req.flush({ message: 'Cart is empty' }, { status: 500, statusText: 'Internal Server Error' });

    expect(receivedMessage).toBe('Cart is empty');
  });
});


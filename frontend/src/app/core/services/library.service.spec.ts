import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LibraryService } from './library.service';

describe('LibraryService', () => {
  let service: LibraryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(LibraryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all products', () => {
    service.getAll().subscribe(products => {
      expect(products.length).toBe(1);
      expect(products[0].title).toBe('Book');
    });

    const req = httpMock.expectOne('/api/products');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, title: 'Book', description: 'desc', type: 'BOOK' }]);
  });

  it('should send FormData when uploading a product file', () => {
    const file = new File(['abc'], 'sample.pdf', { type: 'application/pdf' });

    service.uploadProductFile(file).subscribe();

    const req = httpMock.expectOne('/api/files/upload/product');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush({ url: 'http://file', filename: 'sample.pdf', originalName: 'sample.pdf', size: '3 bytes' });
  });

  it('should call stock removal endpoint with adjustment payload', () => {
    service.removeStock(5, { quantity: 2, reason: 'Borrowed' }).subscribe();

    const req = httpMock.expectOne('/api/products/5/stock/remove');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ quantity: 2, reason: 'Borrowed' });
    req.flush({ id: 5 });
  });
});


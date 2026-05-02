import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {
  CatalogMenuService,
  MenuCategoryDTO,
  CourseMiniDTO
} from './catalog-menu.service';

describe('CatalogMenuService', () => {
  let service: CatalogMenuService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:8081/api/catalog';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CatalogMenuService]
    });

    service = TestBed.inject(CatalogMenuService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get menu categories', () => {
    const mockResponse: MenuCategoryDTO[] = [
      {
        label: 'Development',
        subCategories: ['Java', 'Angular', 'Spring']
      },
      {
        label: 'Design',
        subCategories: ['UI/UX', 'Figma']
      }
    ];

    service.getMenu().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/menu`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should get top courses with category and default limit', () => {
    const mockResponse: CourseMiniDTO[] = [
      { id: 1, title: 'Java Basics' },
      { id: 2, title: 'Advanced Java' }
    ];

    service.getTop('Development').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(request =>
      request.url === `${baseUrl}/top` &&
      request.params.get('category') === 'Development' &&
      request.params.get('limit') === '10' &&
      !request.params.has('subCategory')
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should get top courses with category, subCategory, and custom limit', () => {
    const mockResponse: CourseMiniDTO[] = [
      { id: 3, title: 'Spring Boot Masterclass' }
    ];

    service.getTop('Development', 'Spring', 5).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(request =>
      request.url === `${baseUrl}/top` &&
      request.params.get('category') === 'Development' &&
      request.params.get('subCategory') === 'Spring' &&
      request.params.get('limit') === '5'
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should not include subCategory when it is undefined', () => {
    service.getTop('Design', undefined, 3).subscribe();

    const req = httpMock.expectOne(request =>
      request.url === `${baseUrl}/top` &&
      request.params.get('category') === 'Design' &&
      request.params.get('limit') === '3' &&
      !request.params.has('subCategory')
    );

    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should not include subCategory when it is empty string', () => {
    service.getTop('Business', '', 4).subscribe();

    const req = httpMock.expectOne(request =>
      request.url === `${baseUrl}/top` &&
      request.params.get('category') === 'Business' &&
      request.params.get('limit') === '4' &&
      !request.params.has('subCategory')
    );

    expect(req.request.method).toBe('GET');

    req.flush([]);
  });
});
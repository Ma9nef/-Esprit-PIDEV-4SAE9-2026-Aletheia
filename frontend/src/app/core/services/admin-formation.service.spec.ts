import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AdminFormationService } from './admin-formation.service';
import { Formation } from '../models/formation.model';

describe('AdminFormationService', () => {
  let service: AdminFormationService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8089/api/admin/formations';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminFormationService]
    });

    service = TestBed.inject(AdminFormationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all formations', () => {
    const mockFormations: Formation[] = [
      { id: 1, title: 'Formation 1', archived: true } as Formation,
      { id: 2, title: 'Formation 2', archived: false } as Formation
    ];

    service.getAllFormations().subscribe((formations) => {
      expect(formations).toEqual(mockFormations);
      expect(formations.length).toBe(2);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockFormations);
  });

  it('should get archived formations', () => {
    const mockArchivedFormations: Formation[] = [
      { id: 1, title: 'Archived Formation', archived: true } as Formation
    ];

    service.getArchivedFormations().subscribe((formations) => {
      expect(formations).toEqual(mockArchivedFormations);
      expect(formations[0].archived).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/archived`);
    expect(req.request.method).toBe('GET');
    req.flush(mockArchivedFormations);
  });

  it('should get active formations', () => {
    const mockActiveFormations: Formation[] = [
      { id: 2, title: 'Active Formation', archived: false } as Formation
    ];

    service.getActiveFormations().subscribe((formations) => {
      expect(formations).toEqual(mockActiveFormations);
      expect(formations[0].archived).toBeFalse();
    });

    const req = httpMock.expectOne(`${apiUrl}/active`);
    expect(req.request.method).toBe('GET');
    req.flush(mockActiveFormations);
  });

  it('should archive a formation', () => {
    const formationId = 1;
    const mockFormation: Formation = {
      id: formationId,
      title: 'Formation 1',
      archived: true
    } as Formation;

    service.archiveFormation(formationId).subscribe((formation) => {
      expect(formation).toEqual(mockFormation);
      expect(formation.archived).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/${formationId}/archive`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({});
    req.flush(mockFormation);
  });

  it('should unarchive a formation', () => {
    const formationId = 1;
    const mockFormation: Formation = {
      id: formationId,
      title: 'Formation 1',
      archived: false
    } as Formation;

    service.unarchiveFormation(formationId).subscribe((formation) => {
      expect(formation).toEqual(mockFormation);
      expect(formation.archived).toBeFalse();
    });

    const req = httpMock.expectOne(`${apiUrl}/${formationId}/unarchive`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({});
    req.flush(mockFormation);
  });
});
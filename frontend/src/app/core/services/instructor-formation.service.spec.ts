import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { InstructorFormationService } from './instructor-formation.service';
import { Formation } from '../models/formation.model';

describe('InstructorFormationService', () => {
  let service: InstructorFormationService;
  let httpMock: HttpTestingController;

  const apiUrl = '/api/instructor/formations';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InstructorFormationService]
    });

    service = TestBed.inject(InstructorFormationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get my formations', () => {
    const mockFormations: Formation[] = [
      { id: 1, title: 'Formation 1', archived: true } as Formation,
      { id: 2, title: 'Formation 2', archived: false } as Formation
    ];

    service.getMyFormations().subscribe((formations) => {
      expect(formations).toEqual(mockFormations);
      expect(formations.length).toBe(2);
    });

    const req = httpMock.expectOne(`${apiUrl}/my`);
    expect(req.request.method).toBe('GET');
    req.flush(mockFormations);
  });

  it('should get formation by id', () => {
    const formationId = 5;
    const mockFormation: Formation = {
      id: formationId,
      title: 'Formation details',
      archived: true
    } as Formation;

    service.getFormationById(formationId).subscribe((formation) => {
      expect(formation).toEqual(mockFormation);
      expect(formation.id).toBe(formationId);
    });

    const req = httpMock.expectOne(`${apiUrl}/${formationId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockFormation);
  });

  it('should create a formation', () => {
    const payload: Formation = {
      title: 'New Formation',
      archived: true
    } as Formation;

    const createdFormation: Formation = {
      id: 10,
      title: 'New Formation',
      archived: true
    } as Formation;

    service.createFormation(payload).subscribe((formation) => {
      expect(formation).toEqual(createdFormation);
      expect(formation.id).toBe(10);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(createdFormation);
  });

  it('should update a formation', () => {
    const formationId = 7;
    const payload: Formation = {
      id: formationId,
      title: 'Updated Formation',
      archived: false
    } as Formation;

    const updatedFormation: Formation = {
      id: formationId,
      title: 'Updated Formation',
      archived: false
    } as Formation;

    service.updateFormation(formationId, payload).subscribe((formation) => {
      expect(formation).toEqual(updatedFormation);
      expect(formation.title).toBe('Updated Formation');
    });

    const req = httpMock.expectOne(`${apiUrl}/${formationId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(updatedFormation);
  });
});
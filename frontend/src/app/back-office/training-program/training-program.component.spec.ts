import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { TrainingProgramComponent } from './training-program.component';
import { AdminFormationService } from 'src/app/core/services/admin-formation.service';

describe('TrainingProgramComponent', () => {
  let component: TrainingProgramComponent;
  let fixture: ComponentFixture<TrainingProgramComponent>;
  let formationServiceSpy: jasmine.SpyObj<AdminFormationService>;

  const mockFormations = [
    {
      id: 1,
      title: 'Java Basics',
      description: 'Intro to Java',
      duration: 10,
      capacity: 20,
      location: 'Room A',
      level: 'Beginner',
      startDate: '2026-04-20',
      endDate: '2026-04-30',
      archived: false
    },
    {
      id: 2,
      title: 'Spring Boot',
      description: 'REST API training',
      duration: 7,
      capacity: 15,
      location: 'Room B',
      level: 'Intermediate',
      startDate: '2026-05-01',
      endDate: '2026-05-08',
      archived: true
    }
  ];

  beforeEach(async () => {
    formationServiceSpy = jasmine.createSpyObj('AdminFormationService', [
      'getAllFormations',
      'getArchivedFormations',
      'getActiveFormations',
      'archiveFormation',
      'unarchiveFormation'
    ]);

    formationServiceSpy.getAllFormations.and.returnValue(of(mockFormations as any));

    await TestBed.configureTestingModule({
      declarations: [TrainingProgramComponent],
      imports: [FormsModule],
      providers: [
        { provide: AdminFormationService, useValue: formationServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingProgramComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
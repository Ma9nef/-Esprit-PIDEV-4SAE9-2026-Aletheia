import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { ListSubmissionsComponent } from './list-submissions.component';
import { SubmissionService } from '../core/services/submission.service';
import { UserService } from 'src/app/core/services/user.service';
import { Submission } from '../core/models/Submission.model';

describe('ListSubmissionsComponent', () => {
  let component: ListSubmissionsComponent;
  let fixture: ComponentFixture<ListSubmissionsComponent>;
  let submissionServiceSpy: jasmine.SpyObj<SubmissionService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUsers = [
    { id: 1, prenom: 'Ali', nom: 'Ben Salah' },
    { id: 2, prenom: 'Sara', nom: 'Trabelsi' }
  ];



  const mockSubmissions: Submission[] = [
    {
      id: 101,
      submittedAt: '2026-04-16T08:00:00',
      status: 'GRADED',
      score: 80,
      feedback: 'Réussi',
      user: {
        id: 1,
        nom: 'Ben Salah',
        prenom: 'Ali'
      }
    },
    {
      id: 102,
      submittedAt: '2026-04-16T09:00:00',
      status: 'GRADED',
      score: 40,
      feedback: 'Échoué',
      user: {
        id: 2,
        nom: 'Trabelsi',
        prenom: 'Sara'
      }
    },
    {
      id: 103,
      submittedAt: '2026-04-16T10:00:00',
      status: 'GRADED',
      score: 60,
      feedback: 'Réussi'
    }
  ];
  beforeEach(async () => {
    submissionServiceSpy = jasmine.createSpyObj('SubmissionService', [
      'getAllSubmissions',
      'deleteSubmission'
    ]);

    userServiceSpy = jasmine.createSpyObj('UserService', [
      'getAllUsers'
    ]);

    userServiceSpy.getAllUsers.and.returnValue(of(mockUsers));
    submissionServiceSpy.getAllSubmissions.and.returnValue(of(mockSubmissions));
    submissionServiceSpy.deleteSubmission.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [ListSubmissionsComponent],
      imports: [FormsModule],
      providers: [
        { provide: SubmissionService, useValue: submissionServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ListSubmissionsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users then submissions on init', () => {
    fixture.detectChanges();

    expect(userServiceSpy.getAllUsers).toHaveBeenCalled();
    expect(submissionServiceSpy.getAllSubmissions).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.allSubmissions.length).toBe(3);
    expect(component.filteredSubmissions.length).toBe(3);
  });

  it('should map submission user names correctly', () => {
    fixture.detectChanges();

    expect(component.allSubmissions[0].userName).toBe('Ali Ben Salah');
    expect(component.allSubmissions[1].userName).toBe('Sara Trabelsi');
    expect(component.allSubmissions[2].userName).toBe('Unknown Learner');
  });

  it('should compute displayStatus from feedback or score fallback', () => {
    fixture.detectChanges();

    expect(component.allSubmissions[0].displayStatus).toBe('Réussi');
    expect(component.allSubmissions[1].displayStatus).toBe('Échoué');
    expect(component.allSubmissions[2].displayStatus).toBe('Réussi');
  });

  it('should handle paginated users response', () => {
    userServiceSpy.getAllUsers.and.returnValue(of({ content: mockUsers }));

    fixture.detectChanges();

    expect(component.usersList.length).toBe(2);
    expect(component.allSubmissions.length).toBe(3);
  });

  it('should still load submissions if loading users fails', () => {
    userServiceSpy.getAllUsers.and.returnValue(
      throwError(() => new Error('users error'))
    );

    fixture.detectChanges();

    expect(submissionServiceSpy.getAllSubmissions).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should handle submissions load error', () => {
    submissionServiceSpy.getAllSubmissions.and.returnValue(
      throwError(() => new Error('submissions error'))
    );

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.allSubmissions).toEqual([]);
    expect(component.filteredSubmissions).toEqual([]);
  });

  it('should filter by learner name', () => {
    fixture.detectChanges();

    component.filter.search = 'ali';
    component.applyAdvancedFilters();

    expect(component.filteredSubmissions.length).toBe(1);
    expect(component.filteredSubmissions[0].userName).toBe('Ali Ben Salah');
  });

  it('should filter by status', () => {
    fixture.detectChanges();

    component.filter.status = 'Échoué';
    component.applyAdvancedFilters();

    expect(component.filteredSubmissions.length).toBe(1);
    expect(component.filteredSubmissions[0].displayStatus).toBe('Échoué');
  });

  it('should filter by minimum score', () => {
    fixture.detectChanges();

    component.filter.minScore = 60;
    component.applyAdvancedFilters();

    expect(component.filteredSubmissions.length).toBe(2);
    expect(component.filteredSubmissions.every(s => s.score >= 60)).toBeTrue();
  });

  it('should combine all filters', () => {
    fixture.detectChanges();

    component.filter.search = 'unknown';
    component.filter.status = 'Réussi';
    component.filter.minScore = 50;
    component.applyAdvancedFilters();

    expect(component.filteredSubmissions.length).toBe(1);
    expect(component.filteredSubmissions[0].userName).toBe('Unknown Learner');
  });

  it('should toggle one selected id', () => {
    component.toggleSelect(101);
    expect(component.selectedIds.has(101)).toBeTrue();

    component.toggleSelect(101);
    expect(component.selectedIds.has(101)).toBeFalse();
  });

  it('should select all filtered submissions', () => {
    fixture.detectChanges();

    component.toggleSelectAll({ target: { checked: true } });

    expect(component.selectedIds.size).toBe(3);
    expect(component.selectedIds.has(101)).toBeTrue();
    expect(component.selectedIds.has(102)).toBeTrue();
    expect(component.selectedIds.has(103)).toBeTrue();
  });

  it('should clear all selected submissions', () => {
    fixture.detectChanges();

    component.selectedIds.add(101);
    component.selectedIds.add(102);

    component.toggleSelectAll({ target: { checked: false } });

    expect(component.selectedIds.size).toBe(0);
  });

  it('should export filtered submissions to CSV', () => {
    fixture.detectChanges();

    const fakeLink = jasmine.createSpyObj('HTMLAnchorElement', ['setAttribute', 'click']);
    spyOn(document, 'createElement').and.returnValue(fakeLink as any);
    spyOn(document.body, 'appendChild').and.stub();

    component.exportToCSV();

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(fakeLink.setAttribute).toHaveBeenCalledWith('download', 'learner_report.csv');
    expect(fakeLink.click).toHaveBeenCalled();
  });

  it('should delete selected submissions after confirmation', () => {
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    spyOn(component, 'loadData');

    component.selectedIds.add(101);
    component.selectedIds.add(102);

    component.deleteSelected();

    expect(submissionServiceSpy.deleteSubmission).toHaveBeenCalledWith(101);
    expect(submissionServiceSpy.deleteSubmission).toHaveBeenCalledWith(102);
    expect(component.selectedIds.size).toBe(0);
    expect(component.loadData).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Records deleted successfully');
  });

  it('should not delete selected submissions if confirmation is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.selectedIds.add(101);
    component.deleteSelected();

    expect(submissionServiceSpy.deleteSubmission).not.toHaveBeenCalled();
  });

  it('should handle deleteSelected error', () => {
    fixture.detectChanges();

    submissionServiceSpy.deleteSubmission.and.returnValue(
      throwError(() => new Error('delete error'))
    );

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');

    component.selectedIds.add(101);
    component.deleteSelected();

    expect(component.loading).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith('An error occurred while deleting records.');
  });

  it('should delete one submission after confirmation', () => {
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'loadData');

    component.deleteOne(101);

    expect(submissionServiceSpy.deleteSubmission).toHaveBeenCalledWith(101);
    expect(component.loadData).toHaveBeenCalled();
  });

  it('should not delete one submission if confirmation is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteOne(101);

    expect(submissionServiceSpy.deleteSubmission).not.toHaveBeenCalled();
  });

  it('should handle deleteOne error', () => {
    fixture.detectChanges();

    submissionServiceSpy.deleteSubmission.and.returnValue(
      throwError(() => new Error('delete one error'))
    );

    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteOne(101);

    expect(component.loading).toBeFalse();
  });
});
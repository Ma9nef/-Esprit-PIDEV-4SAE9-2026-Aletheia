import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Formation } from 'src/app/core/models/formation.model';
import {
  AttendanceStatus,
  FormationAttendanceSummary
} from 'src/app/core/models/formation-attendance.model';
import { FormationPublicService } from 'src/app/core/services/formation-public.service';

@Component({
  selector: 'app-formation-program-attendance',
  templateUrl: './formation-program-attendance.component.html',
  styleUrls: ['./formation-program-attendance.component.css']
})
export class FormationProgramAttendanceComponent implements OnInit {

  formation: Formation | null = null;
  attendance: FormationAttendanceSummary | null = null;

  loading = false;
  attendanceLoading = false;

  errorMessage = '';
  attendanceErrorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formationPublicService: FormationPublicService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'Invalid formation id.';
      return;
    }

    this.loadFormation(id);
    this.loadAttendance(id);
  }

  loadFormation(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.formationPublicService.getFormationById(id).subscribe({
      next: (data: Formation) => {
        this.formation = data;
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error while loading attendance page:', error);
        this.errorMessage = 'Failed to load training attendance page.';
        this.loading = false;
      }
    });
  }

  loadAttendance(formationId: number): void {
    this.attendanceLoading = true;
    this.attendanceErrorMessage = '';

    this.formationPublicService.getMyAttendance(formationId).subscribe({
      next: (data: FormationAttendanceSummary) => {
        this.attendance = data;
        this.attendanceLoading = false;
      },
      error: (error: any) => {
        console.error('Error while loading attendance:', error);

        if (error?.error?.message) {
          this.attendanceErrorMessage = error.error.message;
        } else if (typeof error?.error === 'string') {
          this.attendanceErrorMessage = error.error;
        } else {
          this.attendanceErrorMessage = 'Failed to load attendance.';
        }

        this.attendanceLoading = false;
      }
    });
  }

  getAttendanceStatusLabel(status: AttendanceStatus): string {
    switch (status) {
      case 'PRESENT':
        return 'Present';
      case 'ABSENT':
        return 'Absent';
      case 'LATE':
        return 'Late';
      default:
        return 'Not marked';
    }
  }

  getAttendanceStatusClass(status: AttendanceStatus): string {
    switch (status) {
      case 'PRESENT':
        return 'present';
      case 'ABSENT':
        return 'absent';
      case 'LATE':
        return 'late';
      default:
        return 'not-marked';
    }
  }

  getAttendanceRemark(): string {
    if (!this.attendance) {
      return 'Attendance data is not available yet.';
    }

    if (this.attendance.totalSessions === 0) {
      return 'No sessions are planned yet for this training program.';
    }

    if (this.attendance.attendanceRate >= 80) {
      return 'Excellent attendance. Keep maintaining this strong participation.';
    }

    if (this.attendance.attendanceRate >= 50) {
      return 'Your attendance is acceptable, but there is still room for improvement.';
    }

    return 'Your attendance is low. Try to follow the next sessions more regularly.';
  }

  goBackToDashboard(): void {
    if (!this.formation) {
      return;
    }

    this.router.navigate(['/formations', this.formation.id, 'program-space']);
  }

  goBackToMyPrograms(): void {
    this.router.navigate(['/my-enrolled-formations']);
  }
}
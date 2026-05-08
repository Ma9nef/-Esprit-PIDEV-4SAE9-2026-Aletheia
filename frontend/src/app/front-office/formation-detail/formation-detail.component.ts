import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Formation } from 'src/app/core/models/formation.model';
import { MyEnrolledFormation } from 'src/app/core/models/my-enrolled-formation.model';
import { FormationPublicService } from 'src/app/core/services/formation-public.service';

@Component({
  selector: 'app-formation-detail',
  templateUrl: './formation-detail.component.html',
  styleUrls: ['./formation-detail.component.css']
})
export class FormationDetailComponent implements OnInit {

  formation: Formation | null = null;

  loading = false;
  errorMessage = '';

  enrollLoading = false;
  enrollSuccessMessage = '';
  enrollErrorMessage = '';

  userId = 1;
  alreadyEnrolled = false;

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
    this.checkEnrollmentStatus(id);
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
        console.error('Error while loading formation details:', error);
        this.errorMessage = 'Failed to load formation details.';
        this.loading = false;
      }
    });
  }

  checkEnrollmentStatus(formationId: number): void {
    this.formationPublicService.getMyEnrolledFormations().subscribe({
      next: (data: MyEnrolledFormation[]) => {
        this.alreadyEnrolled = data.some(
          (enrollment: MyEnrolledFormation) => enrollment.formation.id === formationId
        );
      },
      error: (error: unknown) => {
        console.error('Error while checking enrollment status:', error);
      }
    });
  }

  enrollNow(): void {
    if (!this.formation || this.alreadyEnrolled) {
      return;
    }

    this.enrollLoading = true;
    this.enrollSuccessMessage = '';
    this.enrollErrorMessage = '';

    this.formationPublicService.enrollInFormation(this.formation.id).subscribe({
      next: () => {
        this.enrollSuccessMessage = 'You have successfully enrolled in this formation.';
        this.enrollLoading = false;
        this.alreadyEnrolled = true;

        this.router.navigate(['/my-enrolled-formations']);
      },
      error: (error: any) => {
        console.error('Enrollment error:', error);

        if (error?.error?.message) {
          this.enrollErrorMessage = error.error.message;
        } else if (typeof error?.error === 'string') {
          this.enrollErrorMessage = error.error;
        } else {
          this.enrollErrorMessage = 'Enrollment failed. Please try again.';
        }

        this.enrollLoading = false;
      }
    });
  }

  goToMyEnrollments(): void {
    this.router.navigate(['/my-enrolled-formations']);
  }

  hasPracticalInfo(): boolean {
    return !!(
      this.formation?.location ||
      this.formation?.startDate ||
      this.formation?.endDate ||
      this.formation?.level
    );
  }

  hasProgramInfo(): boolean {
    return !!(
      this.formation?.objective ||
      this.formation?.prerequisites
    );
  }
}

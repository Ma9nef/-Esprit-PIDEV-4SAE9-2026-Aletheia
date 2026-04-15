import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Formation } from 'src/app/core/models/formation.model';
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

  // Temporary hardcoded learner id for testing
  userId = 1;

  constructor(
    private route: ActivatedRoute,
    private formationPublicService: FormationPublicService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'Invalid formation id.';
      return;
    }

    this.loadFormation(id);
  }

  loadFormation(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.formationPublicService.getFormationById(id).subscribe({
      next: (data: Formation) => {
        this.formation = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error while loading formation details:', error);
        this.errorMessage = 'Failed to load formation details.';
        this.loading = false;
      }
    });
  }

  enrollNow(): void {
    if (!this.formation) {
      return;
    }

    this.enrollLoading = true;
    this.enrollSuccessMessage = '';
    this.enrollErrorMessage = '';

    this.formationPublicService.enrollInFormation(this.formation.id, this.userId).subscribe({
      next: () => {
        this.enrollSuccessMessage = 'You have successfully enrolled in this formation.';
        this.enrollLoading = false;
      },
      error: (error) => {
        console.error('Enrollment error:', error);

        if (error?.error?.message) {
          this.enrollErrorMessage = error.error.message;
        } else {
          this.enrollErrorMessage = 'Enrollment failed. Please try again.';
        }

        this.enrollLoading = false;
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { Formation } from 'src/app/core/models/formation.model';
import { MyEnrolledFormation } from 'src/app/core/models/my-enrolled-formation.model';
import { FormationPublicService } from 'src/app/core/services/formation-public.service';

@Component({
  selector: 'app-formation-list',
  templateUrl: './formation-list.component.html',
  styleUrls: ['./formation-list.component.css']
})
export class FormationListComponent implements OnInit {

  formations: Formation[] = [];
  loading = false;
  errorMessage = '';
  showingEnrolledOnly = false;

  userId = 1;

  constructor(private formationPublicService: FormationPublicService) {}

  ngOnInit(): void {
    this.loadAllFormations();
  }

  loadAllFormations(): void {
    this.loading = true;
    this.errorMessage = '';
    this.showingEnrolledOnly = false;

    this.formationPublicService.getAllFormations().subscribe({
      next: (data: Formation[]) => {
        this.formations = data;
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error while loading formations:', error);
        this.errorMessage = 'Failed to load formations.';
        this.loading = false;
      }
    });
  }

  loadMyEnrolledFormations(): void {
    this.loading = true;
    this.errorMessage = '';
    this.showingEnrolledOnly = true;
  
    this.formationPublicService.getMyEnrolledFormations().subscribe({
      next: (data: MyEnrolledFormation[]) => {
        this.formations = data.map((enrollment) => enrollment.formation);
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error while loading enrolled formations:', error);
        this.errorMessage = 'Failed to load your enrolled formations.';
        this.loading = false;
      }
    });
  }
}

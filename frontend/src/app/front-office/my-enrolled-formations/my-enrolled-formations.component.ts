import { Component, OnInit } from '@angular/core';
import { FormationPublicService } from 'src/app/core/services/formation-public.service';
import { MyEnrolledFormation } from 'src/app/core/models/my-enrolled-formation.model';

@Component({
  selector: 'app-my-enrolled-formations',
  templateUrl: './my-enrolled-formations.component.html',
  styleUrls: ['./my-enrolled-formations.component.css']
})
export class MyEnrolledFormationsComponent implements OnInit {

  formations: MyEnrolledFormation[] = [];
  loading = false;
  errorMessage = '';

  userId = 1;

  constructor(private formationService: FormationPublicService) {}

  ngOnInit(): void {
    this.loadMyEnrolledFormations();
  }

  loadMyEnrolledFormations(): void {
    this.loading = true;
    this.errorMessage = '';

    this.formationService.getMyEnrolledFormations().subscribe({
      next: (data: MyEnrolledFormation[]) => {
        console.log('MY ENROLLED FORMATIONS =', data);
      
        this.formations = data;
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error loading enrolled formations:', error);
        this.errorMessage = 'Failed to load enrolled programs.';
        this.loading = false;
      }
    });
  }
  
}

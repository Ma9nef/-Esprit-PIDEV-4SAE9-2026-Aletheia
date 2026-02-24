import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageCoursesComponent } from './manage-courses/manage-courses.component';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { VerifyCertificateComponent } from '../front-office/verify-certificate/verify-certificate.component';
import { LearnerCertificatesComponent } from '../front-office/learner-certificates/learner-certificates.component';
import { AssessmentFormComponent } from './assessment-form/assessment-form.component';
import { FilterPipe } from '../filter.pipe';
import { ManageCertificatesComponent } from './manage-certificates/manage-certificates.component';
import { ManageAssessmentsComponent } from './manage-assessments/manage-assessments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AdminDashboardComponent,
    ManageUsersComponent,
    ManageCoursesComponent,
    TrainerDashboardComponent,
    ManageCertificatesComponent,
    AssessmentFormComponent, 
    ManageAssessmentsComponent,
    FilterPipe, 
    
    
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,         
    ReactiveFormsModule
  ]
})
export class BackOfficeModule { }

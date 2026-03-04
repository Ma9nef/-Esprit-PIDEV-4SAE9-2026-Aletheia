import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { ManageLibraryComponent } from './manage-library/manage-library.component';
import { ManageCertificatesComponent } from './manage-certificates/manage-certificates.component';
import { AssessmentFormComponent } from './assessment-form/assessment-form.component';
import { ManageAssessmentsComponent } from './manage-assessments/manage-assessments.component';
import { FilterPipe } from '../filter.pipe';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    ManageUsersComponent,
    TrainerDashboardComponent,
    ManageLibraryComponent,
     ManageCertificatesComponent,
    AssessmentFormComponent, 
    ManageAssessmentsComponent,
    FilterPipe, 
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BackOfficeRoutingModule,
     FormsModule,   // 👈 ADD THIS
  ]
})
export class BackOfficeModule { }
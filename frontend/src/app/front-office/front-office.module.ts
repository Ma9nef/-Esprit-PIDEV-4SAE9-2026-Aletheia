import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Added for routing
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Added for [(ngModel)]

import { SharedModule } from '../shared/shared.module';

// Template Components
import { TemplateComponent } from './template/template.component';
import { HomeComponent } from './template/home/home.component';
import { AboutComponent } from './template/about/about.component';
import { ServicesComponent } from './template/services/services.component';

// Feature Components
import { CatalogComponent } from './catalog/catalog.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerifyCertificateComponent } from './verify-certificate/verify-certificate.component';
import { LearnerCertificatesComponent } from './learner-certificates/learner-certificates.component';
import { LearnerAssessmentComponent } from './learner-assessment/learner-assessment.component';

@NgModule({
  declarations: [
    HomeComponent,
    CatalogComponent,
    CourseDetailsComponent,
    ProfileComponent,
    AboutComponent,
    ServicesComponent,
    TemplateComponent,
    DashboardComponent,
    VerifyCertificateComponent,
    LearnerCertificatesComponent,
    LearnerAssessmentComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,        // Required for routerLink and router-outlet
    FormsModule,         // Required for [(ngModel)] in your search bars
    ReactiveFormsModule  // Required for advanced form controls
  ],
  exports: [
    // Export components that need to be used in AppModule (like your layout)
    HomeComponent,
    CatalogComponent,
    CourseDetailsComponent,
    ProfileComponent,
    AboutComponent,
    ServicesComponent,
    TemplateComponent,
    LearnerCertificatesComponent
  ]
})
export class FrontOfficeModule { }
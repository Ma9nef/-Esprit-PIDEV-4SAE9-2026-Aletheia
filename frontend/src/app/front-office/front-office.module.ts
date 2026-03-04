import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogComponent } from './catalog/catalog.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CourseLearningComponent } from './course-learning/course-learning.component'; // ✅ ADD
import { ProfileComponent } from './profile/profile.component';

import { SharedModule } from '../shared/shared.module';
import { AboutComponent } from './template/about/about.component';
import { ServicesComponent } from './template/services/services.component';
import { TemplateComponent } from './template/template.component';
import { HomeComponent } from './template/home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerifyCertificateComponent } from './verify-certificate/verify-certificate.component';
import { LearnerCertificatesComponent } from './learner-certificates/learner-certificates.component';
import { LearnerAssessmentComponent } from './learner-assessment/learner-assessment.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    CatalogComponent,
    CourseDetailsComponent,
    CourseLearningComponent, // ✅ ADD
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
     FormsModule,
  ],
  exports: [
    HomeComponent,
    CatalogComponent,
    CourseDetailsComponent,
    CourseLearningComponent, // ✅ optional (export only if used outside)
    ProfileComponent,
    AboutComponent,
    ServicesComponent
  ]
})
export class FrontOfficeModule { }
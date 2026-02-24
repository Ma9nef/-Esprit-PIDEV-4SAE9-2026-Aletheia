import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CatalogComponent } from './catalog/catalog.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { AboutComponent } from './template/about/about.component';
import { ServicesComponent } from './template/services/services.component';
import { TemplateComponent } from './template/template.component';
import { HomeComponent } from './template/home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerifyCertificateComponent } from './verify-certificate/verify-certificate.component';
import { LearnerCertificatesComponent } from './learner-certificates/learner-certificates.component';




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
  ],
  imports: [
    CommonModule,
     SharedModule,
    DatePipe,
   
    
  ],
  exports: [
    HomeComponent,
    CatalogComponent,
    CourseDetailsComponent,
    ProfileComponent,
    AboutComponent,
    ServicesComponent
  ]
})
export class FrontOfficeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CatalogComponent } from './catalog/catalog.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CourseLearningComponent } from './course-learning/course-learning.component';
import { ProfileComponent } from './profile/profile.component';
import { LibraryComponent } from './library/library.component';

import { SharedModule } from '../shared/shared.module';
import { AboutComponent } from './template/about/about.component';
import { ServicesComponent } from './template/services/services.component';
import { TemplateComponent } from './template/template.component';
import { HomeComponent } from './template/home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerifyCertificateComponent } from './verify-certificate/verify-certificate.component';
import { LearnerCertificatesComponent } from './learner-certificates/learner-certificates.component';
import { LearnerAssessmentComponent } from './learner-assessment/learner-assessment.component';
import { Explore3dComponent } from './explore3d/explore3d.component';
import { VideoRoomComponent } from './video-room/video-room.component';
import { ResourcesComponent } from './resources/resources.component';
import { MyBorrowsComponent } from './my-borrows/my-borrows.component';
import { FormationListComponent } from './formation-list/formation-list.component';
import { FormationDetailComponent } from './formation-detail/formation-detail.component';
import { MyEnrolledFormationsComponent } from './my-enrolled-formations/my-enrolled-formations.component';

@NgModule({
  declarations: [
    HomeComponent,
    CatalogComponent,
    CourseDetailsComponent,
    CourseLearningComponent,
    ProfileComponent,
    LibraryComponent,
    AboutComponent,
    ServicesComponent,
    TemplateComponent,
    DashboardComponent,
    Explore3dComponent,
    VerifyCertificateComponent,
    LearnerCertificatesComponent,
    LearnerAssessmentComponent,
    VideoRoomComponent,
    ResourcesComponent,
    MyBorrowsComponent,
    FormationListComponent,
    FormationDetailComponent,
    MyEnrolledFormationsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    HomeComponent,
    CatalogComponent,
    CourseDetailsComponent,
    CourseLearningComponent,
    ProfileComponent,
    LibraryComponent,
    AboutComponent,
    ServicesComponent,
    Explore3dComponent
  ]
})
export class FrontOfficeModule { }

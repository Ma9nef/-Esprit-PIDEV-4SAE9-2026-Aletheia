import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogComponent } from './catalog/catalog.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
<<<<<<< HEAD
import { CourseLearningComponent } from './course-learning/course-learning.component';
import { ProfileComponent } from './profile/profile.component';
import { LibraryComponent } from './library/library.component';
=======
import { CourseLearningComponent } from './course-learning/course-learning.component'; // ✅ ADD
import { ProfileComponent } from './profile/profile.component';
>>>>>>> origin/course-managment

import { SharedModule } from '../shared/shared.module';
import { AboutComponent } from './template/about/about.component';
import { ServicesComponent } from './template/services/services.component';
import { TemplateComponent } from './template/template.component';
import { HomeComponent } from './template/home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    HomeComponent,
    CatalogComponent,
    CourseDetailsComponent,
<<<<<<< HEAD
    CourseLearningComponent,
    ProfileComponent,
    LibraryComponent,
=======
    CourseLearningComponent, // ✅ ADD
    ProfileComponent,
>>>>>>> origin/course-managment
    AboutComponent,
    ServicesComponent,
    TemplateComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    HomeComponent,
    CatalogComponent,
    CourseDetailsComponent,
<<<<<<< HEAD
    CourseLearningComponent,
    ProfileComponent,
    LibraryComponent,
=======
    CourseLearningComponent, // ✅ optional (export only if used outside)
    ProfileComponent,
>>>>>>> origin/course-managment
    AboutComponent,
    ServicesComponent
  ]
})
<<<<<<< HEAD
export class FrontOfficeModule { }
=======
export class FrontOfficeModule { }
>>>>>>> origin/course-managment

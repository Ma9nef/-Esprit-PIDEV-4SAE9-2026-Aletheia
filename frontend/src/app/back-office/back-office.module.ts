import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { TrainerCoursesComponent } from './trainer-courses/trainer-courses.component';
import { ManageLibraryComponent } from './manage-library/manage-library.component';
import { ManageCertificatesComponent } from './manage-certificates/manage-certificates.component';
import { AssessmentFormComponent } from './assessment-form/assessment-form.component';
import { ManageAssessmentsComponent } from './manage-assessments/manage-assessments.component';
import { FilterPipe } from '../filter.pipe';
import { CreateCourseComponent } from './create-course/create-course.component';
import { CreateLessonComponent } from './create-lesson/create-lesson.component';
import { CourseBuilderComponent } from './courses/course-builder/course-builder.component';
import { EditCourseComponent } from './edit-course/edit-course.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    ManageUsersComponent,
    TrainerDashboardComponent,
    TrainerCoursesComponent,
    ManageLibraryComponent,
    ManageCertificatesComponent,
    AssessmentFormComponent,
    ManageAssessmentsComponent,
    FilterPipe,
    CreateCourseComponent,
    CreateLessonComponent,
    CourseBuilderComponent,
    EditCourseComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BackOfficeRoutingModule,
    RouterModule
  ]
})
export class BackOfficeModule { }

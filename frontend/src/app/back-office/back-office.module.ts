import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BackOfficeRoutingModule } from './back-office-routing.module';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';
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

import { EventFormComponent } from './events/event-form/event-form.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { EventService } from './events/event.service';

import { AllocationDetailComponent } from './allocations/allocation-detail/allocation-detail.component';
import { AllocationFormComponent } from './allocations/allocation-form/allocation-form.component';
import { AllocationListComponent } from './allocations/allocation-list/allocation-list.component';

import { ManageResourcesComponent } from './resources/manage-resources/manage-resources.component';
import { ResourceFormComponent } from './resources/resource-form/resource-form.component';
import { ResourceReservationsComponent } from './resources/resource-reservations/resource-reservations.component';

import { ManageLoansComponent } from './manage-loans/manage-loans.component';
import { BorrowingPoliciesComponent } from './borrowing-policies/borrowing-policies.component';
import { InventoryAnalyticsComponent } from './inventory-analytics/inventory-analytics.component';

import { TrainingProgramComponent } from './training-program/training-program.component';
import { TrainingProgramSessionsComponent } from './training-program-sessions/training-program-sessions.component';
import { AdminTrainingProgramComponent } from './admin-training-program/admin-training-program.component';

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
    EditCourseComponent,
    EventFormComponent,
    EventListComponent,
    AllocationDetailComponent,
    AllocationFormComponent,
    AllocationListComponent,
    ManageResourcesComponent,
    ResourceFormComponent,
    ResourceReservationsComponent,
    ManageLoansComponent,
    BorrowingPoliciesComponent,
    InventoryAnalyticsComponent,
    TrainingProgramComponent,
    TrainingProgramSessionsComponent,
    AdminTrainingProgramComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BackOfficeRoutingModule,
    RouterModule
  ],
  providers: [
    EventService
  ],
  exports: [
    EventFormComponent,
    EventListComponent,
    AllocationDetailComponent,
    AllocationFormComponent,
    AllocationListComponent
  ]
})
export class BackOfficeModule {}

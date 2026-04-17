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
import { EventFormComponent } from './events/event-form/event-form.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { EventService } from './events/event.service';

import { AllocationDetailComponent } from './allocations/allocation-detail/allocation-detail.component';
import { AllocationFormComponent } from './allocations/allocation-form/allocation-form.component';
import { AllocationListComponent } from './allocations/allocation-list/allocation-list.component';
import { ManageResourcesComponent } from './resources/manage-resources/manage-resources.component';
import { ResourceFormComponent } from './resources/resource-form/resource-form.component';
import { ResourceReservationsComponent } from './resources/resource-reservations/resource-reservations.component';
import { MaintenanceListComponent } from './resources/maintenance-list/maintenance-list.component';
import { MaintenanceFormComponent } from './resources/maintenance-form/maintenance-form.component';
import { WaitlistComponent } from './resources/waitlist/waitlist.component';
import { ResourceStatisticsComponent } from './resources/resource-statistics/resource-statistics.component';
import { InstructorReservationsComponent } from './resources/instructor-reservations/instructor-reservations.component';
import { TeachingSessionsComponent } from './resources/teaching-sessions/teaching-sessions.component';
import { ReservationApprovalComponent } from './resources/reservation-approval/reservation-approval.component';
import { CheckinComponent } from './resources/checkin/checkin.component';
import { SwapRequestsComponent } from './resources/swap-requests/swap-requests.component';
import { InstructorProfileComponent } from './resources/instructor-profile/instructor-profile.component';
import { PlatformStatsComponent } from './resources/platform-stats/platform-stats.component';
import { LeaderboardComponent } from './resources/leaderboard/leaderboard.component';
import { UnderutilizedComponent } from './resources/underutilized/underutilized.component';
import { ManageLoansComponent } from './manage-loans/manage-loans.component';
import { BorrowingPoliciesComponent } from './borrowing-policies/borrowing-policies.component';
import { InventoryAnalyticsComponent } from './inventory-analytics/inventory-analytics.component';

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
    EventFormComponent,    // ← Une seule fois
    EventListComponent, AllocationDetailComponent, AllocationFormComponent, AllocationListComponent,
    ManageResourcesComponent,
    ResourceFormComponent,
    ResourceReservationsComponent,
    MaintenanceListComponent,
    MaintenanceFormComponent,
    WaitlistComponent,
    ResourceStatisticsComponent,
    InstructorReservationsComponent,
    TeachingSessionsComponent,
    ReservationApprovalComponent,
    CheckinComponent,
    SwapRequestsComponent,
    InstructorProfileComponent,
    PlatformStatsComponent,
    LeaderboardComponent,
    UnderutilizedComponent,
    ManageLoansComponent,
    BorrowingPoliciesComponent,
    InventoryAnalyticsComponent,
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BackOfficeRoutingModule,
    RouterModule
  ],
  providers: [
    EventService  // ← C'est ICI que va le service
  ],
  exports: [
    EventFormComponent,
    EventListComponent,AllocationDetailComponent, AllocationFormComponent, AllocationListComponent
  ]
})
export class BackOfficeModule { }

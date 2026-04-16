import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { TrainerCoursesComponent } from './trainer-courses/trainer-courses.component';
import { ManageLibraryComponent } from './manage-library/manage-library.component';
import { ManageCoursesComponent } from './manage-courses/manage-courses.component';
import { TrainerHomeComponent } from './trainer-home/trainer-home.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { CreateLessonComponent } from './create-lesson/create-lesson.component';
import { CourseBuilderComponent } from './courses/course-builder/course-builder.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import {AdminOffersComponent} from "./admin-offers/admin-offers.component";
import {OfferFormComponent} from "./offer-form/offer-form.component";
import {AdminCouponsComponent} from "./admin-coupons/admin-coupons.component";
import {CouponFormComponent} from "./coupon-form/coupon-form.component";
import {AdminFlashSalesComponent} from "./admin-flash-sales/admin-flash-sales.component";
import {FlashSaleFormComponent} from "./flash-sale-form/flash-sale-form.component";
import {AdminAnalyticsComponent} from "./admin-analytics/admin-analytics.component";
import {AdminSubscriptionPlansComponent} from "./admin-subscription-plans/admin-subscription-plans.component";
import {
  SubscriptionPlanFormComponent
} from "./admin-subscription-plans/subscription-plan-form/subscription-plan-form.component";
import { EventFormComponent } from './events/event-form/event-form.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { AllocationListComponent } from './allocations/allocation-list/allocation-list.component';
import { AllocationFormComponent } from './allocations/allocation-form/allocation-form.component';
import { AllocationDetailComponent } from './allocations/allocation-detail/allocation-detail.component';
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
const routes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      { path: 'manage-library', component: ManageLibraryComponent },
      { path: 'users', component: ManageUsersComponent },
      { path: 'manage-users', component: ManageUsersComponent },
      { path: 'courses', component: ManageCoursesComponent },
      { path: 'offers', component: AdminOffersComponent },
      { path: 'offers/new', component: OfferFormComponent },
      { path: 'offers/:id', component: OfferFormComponent },
      { path: 'coupons', component: AdminCouponsComponent },
      { path: 'coupons/new', component: CouponFormComponent },
      { path: 'coupons/:id', component: CouponFormComponent },
      { path: 'flash-sales', component: AdminFlashSalesComponent },
      { path: 'flash-sales/new', component: FlashSaleFormComponent },
      { path: 'flash-sales/:id', component: FlashSaleFormComponent },
      {path: 'analytics', component: AdminAnalyticsComponent},
      { path: 'subscription-plans', component: AdminSubscriptionPlansComponent },
      { path: 'subscription-plans/new', component: SubscriptionPlanFormComponent },
      { path: 'subscription-plans/edit/:id', component: SubscriptionPlanFormComponent },
      { path: 'events', component: EventListComponent },
      { path: 'events/new', component: EventFormComponent },
      { path: 'events/edit/:id', component: EventFormComponent },

   { path: 'allocations', component: AllocationListComponent },
   { path: 'allocations/new', component: AllocationFormComponent },
   { path: 'allocations/edit/:id', component: AllocationFormComponent },
   { path: 'allocations/:id', component: AllocationDetailComponent },
   { path: 'resources', component: ManageResourcesComponent },
   { path: 'resources/new', component: ResourceFormComponent },
   { path: 'resources/edit/:id', component: ResourceFormComponent },
   { path: 'resources/reservations/pending', component: ReservationApprovalComponent },
   { path: 'resources/checkin/:id', component: CheckinComponent },
   { path: 'resources/checkin', component: CheckinComponent },
   { path: 'resources/swaps', component: SwapRequestsComponent },
   { path: 'resources/stats/platform', component: PlatformStatsComponent },
   { path: 'resources/stats/leaderboard', component: LeaderboardComponent },
   { path: 'resources/stats/underutilized', component: UnderutilizedComponent },
   { path: 'resources/:id/reservations', component: ResourceReservationsComponent },
   { path: 'resources/:id/maintenance', component: MaintenanceListComponent },
   { path: 'resources/:id/maintenance/new', component: MaintenanceFormComponent },
   { path: 'resources/:id/waitlist', component: WaitlistComponent },
   { path: 'resources/:id/statistics', component: ResourceStatisticsComponent },
   { path: 'loans', component: ManageLoansComponent },
   { path: 'borrowing-policies', component: BorrowingPoliciesComponent },
   { path: 'inventory-analytics', component: InventoryAnalyticsComponent },
    ]
  },

  {
    path: 'trainer',
    component: TrainerDashboardComponent,
    children: [
      { path: '', component: TrainerHomeComponent },
      { path: 'manage-courses', component: ManageCoursesComponent },
      { path: 'reservations', component: InstructorReservationsComponent },
      { path: 'sessions', component: TeachingSessionsComponent },
      { path: 'swaps', component: SwapRequestsComponent },
      { path: 'profile', component: InstructorProfileComponent },
      { path: 'checkin/:id', component: CheckinComponent },
      { path: 'checkin', component: CheckinComponent },
      { path: 'create-course', component: CreateCourseComponent },
      { path: 'courses/:courseId/lessons/create', component: CreateLessonComponent },
      { path: 'courses/:courseId/builder', component: CourseBuilderComponent },
      { path: 'courses/:id/edit', component: EditCourseComponent }
    ]
  },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'trainer-courses', component: TrainerCoursesComponent },
  { path: 'trainer/courses', component: TrainerCoursesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule {}

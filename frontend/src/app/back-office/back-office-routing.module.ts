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
const routes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      { path: 'manage-library', component: ManageLibraryComponent },
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
   { path: 'resources/:id/reservations', component: ResourceReservationsComponent },
    ]
  },

  {
    path: 'trainer',
    component: TrainerDashboardComponent,
    children: [
      { path: '', component: TrainerHomeComponent },
      { path: 'manage-courses', component: ManageCoursesComponent },
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

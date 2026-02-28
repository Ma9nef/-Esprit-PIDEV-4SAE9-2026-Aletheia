import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { TrainerCoursesComponent } from './trainer-courses/trainer-courses.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    ManageUsersComponent,
    TrainerDashboardComponent,
    TrainerCoursesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BackOfficeRoutingModule   // 👈 ADD THIS
  ]
})
export class BackOfficeModule { }
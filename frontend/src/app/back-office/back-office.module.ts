import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageCoursesComponent } from './manage-courses/manage-courses.component';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';



@NgModule({
  declarations: [
    AdminDashboardComponent,
    ManageUsersComponent,
    ManageCoursesComponent,
    TrainerDashboardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BackOfficeModule { }

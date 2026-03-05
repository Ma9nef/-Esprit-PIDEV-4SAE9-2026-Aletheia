import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    AdminDashboardComponent,    // standalone components
    ManageUsersComponent,
    TrainerDashboardComponent
  ]
})
export class BackOfficeModule { }

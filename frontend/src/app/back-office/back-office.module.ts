import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
=======
import { ReactiveFormsModule } from '@angular/forms';
>>>>>>> origin/course-managment

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { TrainerCoursesComponent } from './trainer-courses/trainer-courses.component';
import { ManageLibraryComponent } from './manage-library/manage-library.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    ManageUsersComponent,
    TrainerDashboardComponent,
    TrainerCoursesComponent,
    ManageLibraryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
<<<<<<< HEAD
    FormsModule,
    BackOfficeRoutingModule   // 👈 ADD THIS
  ]
})
export class BackOfficeModule { }
=======
    BackOfficeRoutingModule   // 👈 ADD THIS
  ]
})
export class BackOfficeModule { }
>>>>>>> origin/course-managment

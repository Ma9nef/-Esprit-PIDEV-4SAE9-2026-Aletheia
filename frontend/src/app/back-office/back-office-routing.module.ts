import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { TrainerCoursesComponent } from './trainer-courses/trainer-courses.component';
import { ManageLibraryComponent } from './manage-library/manage-library.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      { path: 'manage-library', component: ManageLibraryComponent }
    ]
  },
  { path: 'trainer', component: TrainerDashboardComponent },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'trainer-courses', component: TrainerCoursesComponent }, // ✅ NEW
  { path: 'trainer/courses', component: TrainerCoursesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule {}
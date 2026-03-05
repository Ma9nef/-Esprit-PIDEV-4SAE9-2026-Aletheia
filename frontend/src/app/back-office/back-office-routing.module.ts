import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { TrainerCoursesComponent } from './trainer-courses/trainer-courses.component';
import { ManageLibraryComponent } from './manage-library/manage-library.component';
import { EventFormComponent } from './events/event-form/event-form.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { AllocationListComponent } from './allocations/allocation-list/allocation-list.component';
import { AllocationFormComponent } from './allocations/allocation-form/allocation-form.component';
import { AllocationDetailComponent } from './allocations/allocation-detail/allocation-detail.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      { path: 'manage-library', component: ManageLibraryComponent },
      { path: 'manage-users', component: ManageUsersComponent }
    ]
  },
    { path: 'events', component: EventListComponent },
  { path: 'events/new', component: EventFormComponent },
  { path: 'events/edit/:id', component: EventFormComponent },

  { path: 'trainer', component: TrainerDashboardComponent },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'trainer-courses', component: TrainerCoursesComponent }, // ✅ NEW
  { path: 'trainer/courses', component: TrainerCoursesComponent },


  
   { path: 'allocations', component: AllocationListComponent },
  { path: 'allocations/new', component: AllocationFormComponent },
  { path: 'allocations/edit/:id', component: AllocationFormComponent },
  { path: 'allocations/:id', component: AllocationDetailComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule {}

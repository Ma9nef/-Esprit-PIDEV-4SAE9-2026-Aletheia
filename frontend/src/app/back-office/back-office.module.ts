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
import { EventFormComponent } from './events/event-form/event-form.component';
import { EventListComponent } from './events/event-list/event-list.component';

// Service
import { EventService } from './events/event.service';
import { AllocationDetailComponent } from './allocations/allocation-detail/allocation-detail.component';
import { AllocationFormComponent } from './allocations/allocation-form/allocation-form.component';
import { AllocationListComponent } from './allocations/allocation-list/allocation-list.component';
import { BackOfficeDashboardComponent } from './back-office-dashboard/back-office-dashboard.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    ManageUsersComponent,
    TrainerDashboardComponent,
    TrainerCoursesComponent,
    ManageLibraryComponent,
    EventFormComponent,    // ← Une seule fois
    EventListComponent, AllocationDetailComponent, AllocationFormComponent, AllocationListComponent, BackOfficeDashboardComponent  ,
    BackOfficeDashboardComponent
    // ← Une seule fois
    // ⚠️ SUPPRIMEZ EventService d'ici !
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    BackOfficeRoutingModule
  ],
  providers: [
    EventService  // ← C'est ICI que va le service
  ],
  exports: [
    EventFormComponent,
    EventListComponent,AllocationDetailComponent, AllocationFormComponent, AllocationListComponent,BackOfficeDashboardComponent
  ]
})
export class BackOfficeModule { }
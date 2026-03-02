import { Routes } from '@angular/router';
import { Home } from './home/home.Component';
import { LoginComponent } from './login/login.Component';
import { RegisterComponent } from './register/register.Component';
import { Dashboard } from './dashboard/dashboard.Component';
import { App } from './app';
import { VideoRoom } from './video-room/video-room';
import { EventListComponent } from './events/event-list/event-list';
import { EventFormComponent } from './events/event-form/event-form';

import { AllocationListComponent } from './allocations/allocation-list/allocation-list';
import { AllocationFormComponent } from './allocations/allocation-form/allocation-form';
import { AllocationDetailComponent } from './allocations/allocation-detail/allocation-detail';

export const routes: Routes = [
  { path: '', component: Home },               // Home par défaut
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: Dashboard },
    { path: 'room/:id', component: VideoRoom },
     // Nouvelles routes pour les événements
  { path: 'events', component: EventListComponent },
  { path: 'events/new', component: EventFormComponent },
  { path: 'events/edit/:id', component: EventFormComponent },
  


   { path: 'allocations', component: AllocationListComponent },
  { path: 'allocations/new', component: AllocationFormComponent },
  { path: 'allocations/edit/:id', component: AllocationFormComponent },
  { path: 'allocations/:id', component: AllocationDetailComponent },
  

  { path: '**', redirectTo: '' }               // pour toute route inconnue
];

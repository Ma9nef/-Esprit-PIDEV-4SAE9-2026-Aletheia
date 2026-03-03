import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './front-office/template/about/about.component';
import { ServicesComponent } from './front-office/template/services/services.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TemplateComponent } from './front-office/template/template.component';
import { HomeComponent } from './front-office/template/home/home.component';
import { DashboardComponent } from './front-office/dashboard/dashboard.component';
import { TrainerDashboardComponent } from './back-office/trainer-dashboard/trainer-dashboard.component';
import { AdminDashboardComponent } from './back-office/admin-dashboard/admin-dashboard.component';
<<<<<<< HEAD
import { ManageLibraryComponent } from './back-office/manage-library/manage-library.component';
import { ManageUsersComponent } from './back-office/manage-users/manage-users.component';
=======
>>>>>>> origin/course-managment
import { CatalogComponent } from './front-office/catalog/catalog.component';
import { CourseDetailsComponent } from './front-office/course-details/course-details.component';
import { CourseLearningComponent } from './front-office/course-learning/course-learning.component';
import { ManageCoursesComponent } from './back-office/manage-courses/manage-courses.component';
<<<<<<< HEAD
import { LibraryComponent } from './front-office/library/library.component';
=======
>>>>>>> origin/course-managment

const routes: Routes = [
  {path:"",component:TemplateComponent},
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  {path:'contact', component: FooterComponent},
  {path: 'dashboardLearner',component: DashboardComponent},
  {path: 'dashboardInstructor',component: TrainerDashboardComponent},
<<<<<<< HEAD
  {
    path: 'dashboardAdmin',
    component: AdminDashboardComponent,
    children: [
      { path: 'manage-library', component: ManageLibraryComponent },
      { path: 'manage-users', component: ManageUsersComponent }
    ]
  },
  { path: 'front/courses', component: CatalogComponent },
  { path: 'front/course-details/:id', component: CourseDetailsComponent },
  { path: 'front/courses/:courseId/learn', component: CourseLearningComponent },
  { path: 'front/library', component: LibraryComponent },
=======
  {path: 'dashboardAdmin', component:AdminDashboardComponent },
  { path: 'front/courses', component: CatalogComponent },
  { path: 'front/course-details/:id', component: CourseDetailsComponent },
  { path: 'front/courses/:courseId/learn', component: CourseLearningComponent },
>>>>>>> origin/course-managment
  {path: 'back-office/manage-courses',component: ManageCoursesComponent},
  {path: 'back-office',loadChildren: () => import('./back-office/back-office.module').then(m => m.BackOfficeModule)},

  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  }
<<<<<<< HEAD

=======
  
>>>>>>> origin/course-managment
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

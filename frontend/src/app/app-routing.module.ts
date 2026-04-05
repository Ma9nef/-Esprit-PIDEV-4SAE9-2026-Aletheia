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
import { ManageLibraryComponent } from './back-office/manage-library/manage-library.component';
import { ManageUsersComponent } from './back-office/manage-users/manage-users.component';
import { CatalogComponent } from './front-office/catalog/catalog.component';
import { CourseDetailsComponent } from './front-office/course-details/course-details.component';
import { CourseLearningComponent } from './front-office/course-learning/course-learning.component';
import { ManageAssessmentsComponent } from './back-office/manage-assessments/manage-assessments.component';
import { VerifyCertificateComponent } from './front-office/verify-certificate/verify-certificate.component';
import { AssessmentFormComponent } from './back-office/assessment-form/assessment-form.component';
import { ManageCertificatesComponent } from './back-office/manage-certificates/manage-certificates.component';
import { LearnerCertificatesComponent } from './front-office/learner-certificates/learner-certificates.component';
import { LearnerAssessmentComponent } from './front-office/learner-assessment/learner-assessment.component';
import { ManageCoursesComponent } from './back-office/manage-courses/manage-courses.component';
import { LibraryComponent } from './front-office/library/library.component';
import { Explore3dComponent } from './front-office/explore3d/explore3d.component';
import {OffersListComponent} from "./front-office/offers-list/offers-list.component";
import {CheckoutComponent} from "./front-office/checkout/checkout.component";
import {SubscriptionPlansListComponent} from "./front-office/subscription-plans-list/subscription-plans-list.component";
import { ExploreCertificatesComponent } from './pages/explore-certificates/explore-certificates.component';
import { ListSubmissionsComponent } from './list-submissions/list-submissions.component';

const routes: Routes = [
  { path: '', component: TemplateComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contact', component: FooterComponent },
  { path: 'dashboardLearner', component: DashboardComponent },
  { path: 'dashboardInstructor', component: TrainerDashboardComponent },
  { path: 'offers', component: OffersListComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'plans', component: SubscriptionPlansListComponent },
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
  { path: 'manage-assessments', component: ManageAssessmentsComponent },
  { path: 'verify/:code', component: VerifyCertificateComponent },
  { path: 'add-assessment', component: AssessmentFormComponent },
  { path: 'manage-certificates', component: ManageCertificatesComponent },
  { path: 'edit-assessment/:id', component: AssessmentFormComponent },
  { path: 'my-certificates', component: LearnerCertificatesComponent },
  { path: 'assessment', component: LearnerAssessmentComponent },
  { path: 'front/library', component: LibraryComponent },
  { path: 'explore', component: Explore3dComponent },
    { path: 'submissions', component: ListSubmissionsComponent },
   { path: 'Explore3dcertificates', component: ExploreCertificatesComponent }, 
  { path: 'back-office/manage-courses', component: ManageCoursesComponent },
  {
    path: 'back-office',
    loadChildren: () => import('./back-office/back-office.module').then(m => m.BackOfficeModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

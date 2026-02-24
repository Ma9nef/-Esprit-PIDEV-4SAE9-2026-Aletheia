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
import { CatalogComponent } from './front-office/catalog/catalog.component';
import { CourseDetailsComponent } from './front-office/course-details/course-details.component';
import { ManageAssessmentsComponent } from './back-office/manage-assessments/manage-assessments.component';
import { AssessmentFormComponent } from './back-office/assessment-form/assessment-form.component';
import { LearnerCertificatesComponent } from './front-office/learner-certificates/learner-certificates.component';
import { VerifyCertificateComponent } from './front-office/verify-certificate/verify-certificate.component';
import { ManageCertificatesComponent } from './back-office/manage-certificates/manage-certificates.component';

const routes: Routes = [
  {path:"",component:TemplateComponent},
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  {path:'contact', component: FooterComponent},
  {path: 'dashboardLearner',component: DashboardComponent},
  {path: 'dashboardInstructor',component: TrainerDashboardComponent},
  {path: 'dashboardAdmin', component:AdminDashboardComponent },
  { path: 'front/courses', component: CatalogComponent },
  { path: 'front/course-details/:id', component: CourseDetailsComponent },
    {path: 'manage-assessments', component:ManageAssessmentsComponent },
  { path: 'verify/:code', component: VerifyCertificateComponent },
    { path: 'add-assessment', component: AssessmentFormComponent }, 
     { path: 'manage-certificates', component: ManageCertificatesComponent },
  { path: 'edit-assessment/:id', component: AssessmentFormComponent  },
  { path: 'my-certificates', component: LearnerCertificatesComponent },  
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

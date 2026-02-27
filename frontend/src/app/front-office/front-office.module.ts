import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogComponent } from './catalog/catalog.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { AboutComponent } from './template/about/about.component';
import { ServicesComponent } from './template/services/services.component';
import { TemplateComponent } from './template/template.component';
import { HomeComponent } from './template/home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';




@NgModule({
  declarations: [
    HomeComponent,
    CatalogComponent,
    CourseDetailsComponent,
    ProfileComponent,
    AboutComponent,
    ServicesComponent,
    TemplateComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    HomeComponent,
    CatalogComponent,
    CourseDetailsComponent,
    ProfileComponent,
    AboutComponent,
    ServicesComponent
  ]
})
export class FrontOfficeModule { }

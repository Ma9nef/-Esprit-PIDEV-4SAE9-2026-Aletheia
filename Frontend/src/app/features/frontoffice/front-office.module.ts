import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AboutComponent } from './template/about/about.component';
import { ServicesComponent } from './template/services/services.component';
import { TemplateComponent } from './template/template.component';
import { HomeComponent } from './template/home/home.component';




@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HomeComponent,          // ✅ standalone
    AboutComponent,         // ✅
    ServicesComponent,      // ✅
    TemplateComponent,      // ✅
    // ✅
  ],
  exports: [
    HomeComponent,
    AboutComponent,
    ServicesComponent
  ]
})
export class FrontOfficeModule { }

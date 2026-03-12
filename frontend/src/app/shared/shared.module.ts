import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { CourseCardComponent } from './course-card/course-card.component';
import { ExploreMegaMenuComponent } from './explore-mega-menu/explore-mega-menu.component';



@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    CourseCardComponent,
    ExploreMegaMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    CourseCardComponent,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontOfficeModule } from './front-office/front-office.module';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule,  } from '@angular/forms';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from '@angular/common';
import { ExploreCertificatesComponent } from './pages/explore-certificates/explore-certificates.component';
import { ListSubmissionsComponent } from './list-submissions/list-submissions.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent,
    ExploreCertificatesComponent,
    ListSubmissionsComponent
  ],
    imports: [
    BrowserModule,
    AppRoutingModule,
    FrontOfficeModule,
    SharedModule,
    FormsModule,
    AuthModule,
    HttpClientModule,
    CommonModule,
    RouterModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

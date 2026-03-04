import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Requis pour date pipe et ngClass
 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontOfficeModule } from './front-office/front-office.module';
import { SharedModule } from './shared/shared.module';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule,  } from '@angular/forms';
import { AuthModule } from './auth/auth.module';
import { BackOfficeModule } from './back-office/back-office.module';
import { JwtInterceptor } from './core/interceptors/auth.interceptor';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FrontOfficeModule,
    
    SharedModule,
    FormsModule  ,
    CommonModule,
    AuthModule,
    HttpClientModule,
     FormsModule,  

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

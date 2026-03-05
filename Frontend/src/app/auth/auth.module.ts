import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule   ,
    LoginComponent,
    RegisterComponent,
    AuthRoutingModule
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    ]

})
export class AuthModule { }

import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

export const appConfig = {
  providers: [
    importProvidersFrom(BrowserModule, HttpClientModule, ReactiveFormsModule),
    provideRouter(routes)
  ]
};

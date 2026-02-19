import { Routes } from '@angular/router';
import { ProductsListComponent } from './features/products/products-list/products-list.component';

export const routes: Routes = [
  { path: 'products', component: ProductsListComponent },
  { path: '',         redirectTo: 'products', pathMatch: 'full' },
  { path: '**',       redirectTo: 'products' },
];

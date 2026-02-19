import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '',          component: CatalogComponent },
      { path: 'product/:id', component: ProductDetailComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];

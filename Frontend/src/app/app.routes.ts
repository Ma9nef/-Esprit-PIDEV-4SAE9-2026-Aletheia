import { Routes } from '@angular/router';
import { OffersListComponent } from './features/frontoffice/pages/offers-list/offers-list.component';
import { CheckoutComponent } from './features/frontoffice/pages/checkout/checkout.component';
import { AdminLayoutComponent } from './features/backoffice/layout/admin-layout.component';
import { AdminOffersComponent } from './features/backoffice/pages/admin-offers/admin-offers.component';
import { AdminCouponsComponent } from './features/backoffice/pages/admin-coupons/admin-coupons.component';
import { AdminFlashSalesComponent } from './features/backoffice/pages/admin-flash-sales/admin-flash-sales.component';
import { OfferFormComponent } from './features/backoffice/pages/offer-form/offer-form.component';
import { CouponFormComponent } from './features/backoffice/pages/coupon-form/coupon-form.component';
import { FlashSaleFormComponent } from './features/backoffice/pages/flash-sale-form/flash-sale-form.component';

export const routes: Routes = [
  // Frontoffice
  { path: '', redirectTo: '/offers', pathMatch: 'full' },
  { path: 'offers', component: OffersListComponent },
  { path: 'checkout', component: CheckoutComponent },
  // Backoffice
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'offers', pathMatch: 'full' },
      { path: 'offers', component: AdminOffersComponent },
      { path: 'offers/new', component: OfferFormComponent },
      { path: 'offers/:id', component: OfferFormComponent },
      { path: 'coupons', component: AdminCouponsComponent },
      { path: 'coupons/new', component: CouponFormComponent },
      { path: 'coupons/:id', component: CouponFormComponent },
      { path: 'flash-sales', component: AdminFlashSalesComponent },
      { path: 'flash-sales/new', component: FlashSaleFormComponent },
      { path: 'flash-sales/:id', component: FlashSaleFormComponent }
    ]
  },
  { path: '**', redirectTo: '/offers' }
];

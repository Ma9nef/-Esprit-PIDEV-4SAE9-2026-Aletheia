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
import {AdminAnalyticsComponent} from './features/backoffice/pages/admin-analytics/admin-analytics.component';
import {
  AdminSubscriptionPlansComponent
} from './features/backoffice/pages/admin-subscription-plans/admin-subscription-plans.component';
import {
  SubscriptionPlanFormComponent
} from './features/backoffice/pages/admin-subscription-plans/subscription-plan-form/subscription-plan-form.component';
import {
  AdminSubscriptionsComponent
} from './features/backoffice/pages/admin-subscriptions/admin-subscriptions.component';
import {
  SubscriptionPlansListComponent
} from './features/frontoffice/pages/subscription-plans-list/subscription-plans-list.component';
import { AboutComponent } from './features/frontoffice/template/about/about.component';
import { ServicesComponent } from './features/frontoffice/template/services/services.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TemplateComponent } from './features/frontoffice/template/template.component';
import { HomeComponent } from './features/frontoffice/template/home/home.component';
import {AuthGuard} from './core/guards/auth.guards';
import {RoleGuard} from './core/guards/role.guard';

export const routes: Routes = [
  // Frontoffice
  { path: '', redirectTo: '/offers', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  {path:'contact', component: FooterComponent},
  { path: 'offers', component: OffersListComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'plans', component: SubscriptionPlansListComponent },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },
  // Backoffice
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],          // ← protection
    data: { expectedRole: 'ADMIN' },
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
      { path: 'flash-sales/:id', component: FlashSaleFormComponent },
      {path: 'analytics', component: AdminAnalyticsComponent},
      // Nouveaux : gestion des abonnements (backoffice)
      { path: 'subscription-plans', component: AdminSubscriptionPlansComponent },
      { path: 'subscription-plans/new', component: SubscriptionPlanFormComponent },
      { path: 'subscription-plans/edit/:id', component: SubscriptionPlanFormComponent },
      { path: 'subscriptions', component: AdminSubscriptionsComponent }
    ]
  },
  { path: '**', redirectTo: '/offers' }
];

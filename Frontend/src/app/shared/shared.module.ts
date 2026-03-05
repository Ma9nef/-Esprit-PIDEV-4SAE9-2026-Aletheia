import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Composants standalone
import { OfferCardComponent } from './components/offer-card/offer-card.component';
import { PriceDisplayComponent } from './components/price-display/price-display.component';
import { CountdownTimerComponent } from './components/countdown-timer/countdown-timer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
// Pipe standalone
import { OfferFilterPipe } from './pipes/offer-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    // ✅ On les importe ici
    OfferCardComponent,
    PriceDisplayComponent,
    CountdownTimerComponent,
    OfferFilterPipe,
    NavbarComponent,
    FooterComponent,
  ],
  exports: [
    OfferCardComponent,
    PriceDisplayComponent,
    CountdownTimerComponent,
    OfferFilterPipe,
    NavbarComponent,
    FooterComponent,
    CommonModule
  ]
})
export class SharedModule {}

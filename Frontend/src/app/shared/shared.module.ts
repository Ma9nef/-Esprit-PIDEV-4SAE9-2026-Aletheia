import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Composants standalone
import { OfferCardComponent } from './components/offer-card/offer-card.component';
import { PriceDisplayComponent } from './components/price-display/price-display.component';
import { CountdownTimerComponent } from './components/countdown-timer/countdown-timer.component';

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
    OfferFilterPipe
  ],
  exports: [
    OfferCardComponent,
    PriceDisplayComponent,
    CountdownTimerComponent,
    OfferFilterPipe,
    CommonModule
  ]
})
export class SharedModule {}

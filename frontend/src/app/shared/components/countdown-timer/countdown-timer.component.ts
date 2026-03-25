import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countdown-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="countdown-timer" *ngIf="!isExpired">
      <div class="time-block" *ngIf="days > 0">
        <span class="number">{{ days }}</span>
        <span class="label">jours</span>
      </div>
      <div class="time-block">
        <span class="number">{{ hours.toString().padStart(2, '0') }}</span>
        <span class="label">heures</span>
      </div>
      <div class="time-block">
        <span class="number">{{ minutes.toString().padStart(2, '0') }}</span>
        <span class="label">minutes</span>
      </div>
      <div class="time-block">
        <span class="number">{{ seconds.toString().padStart(2, '0') }}</span>
        <span class="label">secondes</span>
      </div>
    </div>
    <div class="expired-message" *ngIf="isExpired">
      Offre expirée
    </div>
  `,
  styles: [`
    .countdown-timer {
      display: flex;
      gap: 8px;
      padding: 8px;
      background: #f5f5f5;
      border-radius: 4px;
    }
    .time-block {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .number {
      font-size: 1.2rem;
      font-weight: bold;
      color: #333;
    }
    .label {
      font-size: 0.7rem;
      color: #666;
    }
    .expired-message {
      color: #f44336;
      font-style: italic;
    }
  `]
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  @Input() endDate!: Date;

  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  isExpired: boolean = false;

  private timerInterval: any;

  ngOnInit(): void {
    this.updateCountdown();
    this.timerInterval = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const end = new Date(this.endDate).getTime();
    const distance = end - now;

    if (distance < 0) {
      this.isExpired = true;
      return;
    }

    this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
  }
}

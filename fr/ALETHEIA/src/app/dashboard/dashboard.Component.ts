import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.Component.html',
  styleUrls: ['./dashboard.Component.css']
})
export class Dashboard {
  constructor(private router: Router) {}

  goToRoom() {
    this.router.navigate(['/room', 5]);
  }
}
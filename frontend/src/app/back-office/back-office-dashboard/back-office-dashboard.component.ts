import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-back-office-dashboard',
  templateUrl: './back-office-dashboard.component.html',
  styleUrls: ['./back-office-dashboard.component.css']
})
export class BackOfficeDashboardComponent {
  constructor(private router: Router) {}

}

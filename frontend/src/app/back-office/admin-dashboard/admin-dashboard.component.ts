<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
=======
import { Component } from '@angular/core';
>>>>>>> origin/course-managment

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
<<<<<<< HEAD
export class AdminDashboardComponent implements OnInit {
  showDashboardContent = true;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    // Listen for child route changes
    this.activatedRoute.firstChild?.url.subscribe(() => {
      // If there's a child route active (like manage-library or manage-users), hide dashboard content
      this.showDashboardContent = !this.activatedRoute.firstChild;
    });
  }
=======
export class AdminDashboardComponent {

>>>>>>> origin/course-managment
}

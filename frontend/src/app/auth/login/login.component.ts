import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  cardVisible = false;

  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.cardVisible = true;
    });
  }

  login() {
    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {

        const role = localStorage.getItem('role');

        if (role === 'INSTRUCTOR') {
          this.router.navigate(['/back-office/trainer']);
        } 
        else if (role === 'ADMIN') {
          this.router.navigate(['/back-office/admin']);
        } 
        else {
          this.router.navigate(['/front/courses']);
        }

      },
      error: () => {
        alert("Login failed");
      }
    });
  }
}
import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  /** Uniquement pour l’animation d’entrée de la card (fade + translateY). Aucune logique métier. */
  cardVisible = false;

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.cardVisible = true;
    });
  }


  email = '';
  password = '';
  constructor(private auth: AuthService,
              private router: Router) {}
              login() {
                this.auth.login({
                  email: this.email,
                  password: this.password
                }).subscribe({
                  next: () => {
                    // optional: remove alert in production UX
                    // alert("Login success");
                    this.router.navigate(['/front/courses']);
                  },
                  error: () => alert("Login failed")
                });
              }









}

import { Component, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit {
  // For card entrance animation only. No business logic.
  cardVisible = false;

  nom = '';
  prenom = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;

  submitting = false;
  passwordMismatch = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.cardVisible = true;
    });
  }

  register(form: NgForm): void {
    this.passwordMismatch = false;

    if (form.invalid) return;

    if (this.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    const payload = {
      nom: this.nom.trim(),
      prenom: this.prenom.trim(),
      email: this.email.toLowerCase().trim(),
      password: this.password
    };

    this.submitting = true;

    this.auth.register(payload).subscribe({
      next: () => {
        // keep the credentials BEFORE resetting anything
        const email = payload.email;
        const password = payload.password;

        form.resetForm();
        this.submitting = false;

        // auto login after register, then redirect to courses
        this.auth.login({ email, password }).subscribe({
          next: () => this.router.navigate(['/front/courses']),
          error: () => this.router.navigate(['/auth/login'])
        });
      },
      error: (err) => {
        this.submitting = false;

        let msg = 'Erreur serveur';
        if (err?.error?.message) msg = err.error.message;
        if (err?.status === 409) msg = 'Email déjà utilisé';

        alert(msg);
      }
    });
  }
}

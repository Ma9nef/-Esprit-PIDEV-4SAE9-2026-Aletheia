import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,             // <-- obligatoire
  imports: [ReactiveFormsModule, RouterModule],  // <-- ici
  templateUrl: './login.Component.html',
  styleUrls: ['./login.Component.css']
})
export class LoginComponent {
  loginForm: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          if (res) {
            localStorage.setItem('token', res);
            alert("Connexion réussie ✅");
            this.router.navigate(['/dashboard']);
          } else {
            alert("Erreur de connexion ❌");
          }
        },
        error: () => alert("Erreur de connexion ❌")
      });
    } else {
      alert("Formulaire invalide ❌");
    }
  }
}

import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule], // <-- important
  templateUrl: './register.Component.html',
  styleUrls: ['./register.Component.css']
})
export class RegisterComponent {
  registerForm: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (res: any) => {
          alert("Inscription réussie ✅");
          this.router.navigate(['/login']);
        },
        error: () => alert("Erreur lors de l'inscription ❌")
      });
    } else {
      alert("Formulaire invalide ❌");
    }
  }
}

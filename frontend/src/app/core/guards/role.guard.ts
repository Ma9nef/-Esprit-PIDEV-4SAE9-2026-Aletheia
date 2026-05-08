import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const user = this.auth.getUserFromToken(); // récupère l'utilisateur à partir du token
    const userRole = user?.role || '';

    if (userRole === expectedRole) {
      return true;
    }
    this.router.navigate(['/']); // redirige vers l'accueil si le rôle ne correspond pas
    return false;
  }
}

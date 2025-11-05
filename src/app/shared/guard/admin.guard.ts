import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    console.log('AdminGuard: Checking authentication...');
    console.log('AdminGuard: IsLoggedIn =', this.authService.isLoggedIn());
    console.log('AdminGuard: Current user =', this.authService.getCurrentUser());
    
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      console.log('AdminGuard: User not authenticated, redirecting to login');
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    // First, ensure the user is authenticated.
    return this.authService.isAuthenticated$.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/auth/login']);
          return of(false);
        }
        // If authenticated, check for the Admin role.
        return this.authService.currentUser$.pipe(
          take(1),
          map(user => {
            if (user && user.roles.includes('Admin')) {
              return true;
            } else {
              this.router.navigate(['/scores']); // Redirect non-admins
              return false;
            }
          })
        );
      })
    );
  }
}

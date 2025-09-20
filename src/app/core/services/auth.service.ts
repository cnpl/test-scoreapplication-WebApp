import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));

  constructor(private apiService: ApiService, private router: Router) { }

  // Check the backend to see if a session is still valid
  checkSession(): Observable<boolean> {
    return this.apiService.get<User>('/auth/me').pipe(
      tap(user => this.currentUserSubject.next(user)),
      map(user => !!user),
      catchError(() => {
        this.currentUserSubject.next(null);
        return of(false);
      })
    );
  }

  login(credentials: { email: string, password: string }): Observable<User> {
    return this.apiService.post<User>('/auth/login', credentials).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.router.navigate(['/scores']);
      })
    );
  }

  logout() {
    return this.apiService.post('/auth/logout', {}).subscribe(() => {
      this.currentUserSubject.next(null);
      this.router.navigate(['/auth/login']);
    });
  }
}

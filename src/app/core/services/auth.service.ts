import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { User } from '../interface/user.interface';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    this.apiService.get<{ isAuthenticated: boolean; user: User }>('auth/status')
      .subscribe({
        next: (response) => {
          if (response.isAuthenticated) {
            this.currentUser.set(response.user);
            this.isAuthenticated.set(true);
          }
        },
        error: () => {
          this.currentUser.set(null);
          this.isAuthenticated.set(false);
        },
      });
  }

  login(): void {
    window.location.href = `${environment.apiUrl}/auth/github`;
  }

  logout(): Observable<any> {
    return this.apiService.get('auth/logout').pipe(
      tap(() => {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      })
    );
  }
}
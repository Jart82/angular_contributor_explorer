import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-contributor-explorer');
  authService = inject(AuthService);

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        window.location.href = '/';
      }
    });
  }
}

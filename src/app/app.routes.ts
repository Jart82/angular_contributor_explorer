import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/contributors',
    pathMatch: 'full'
  },
  {
    path: 'contributors',
    loadComponent: () => import('./features/contributors/contributor-list/contributor-list')
      .then(m => m.ContributorListComponent)
  },
  {
    path: 'contributors/:username',
    loadComponent: () => import('./features/contributors/contributor-detail/contributor-detail')
      .then(m => m.ContributorDetail)
  },
  {
    path: 'repositories/:name',
    loadComponent: () => import('./features/repositories/repository-detail/repository-detail')
      .then(m => m.RepositoryDetail)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.Login)
  },
  {
    path: '**',
    redirectTo: '/contributors'
  }
];
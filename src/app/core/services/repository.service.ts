import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Repository {
  name: string;
  full_name: string;
  description: string;
  stars: number;
  forks: number;
  watchers?: number;
  language: string;
  url: string;
  created_at: string;
  updated_at: string;
  contributors?: RepositoryContributor[];
}

export interface RepositoryContributor {
  login: string;
  avatar_url: string;
  contributions: number;
  profile_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class RepositoryService {
  private apiService = inject(ApiService);

  getRepositories(): Observable<Repository[]> {
    return this.apiService.get<Repository[]>('repositories');
  }

  getRepositoryDetails(repoName: string): Observable<Repository> {
    return this.apiService.get<Repository>(`repositories/${repoName}`);
  }
}
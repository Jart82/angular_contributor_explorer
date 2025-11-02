import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Repository } from '../../../core/interface/repository.interface';



@Component({
  selector: 'app-repository-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './repository-detail.html',
  styleUrl: './repository-detail.css',
})
export class RepositoryDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  repository = signal<Repository | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const repoName = this.route.snapshot.paramMap.get('name');
    if (repoName) {
      this.loadRepository(repoName);
    }
  }

  loadRepository(repoName: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<Repository>(`http://localhost:3000/repositories/${repoName}`).subscribe({
      next: (repository) => {
        this.repository.set(repository);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load repository details');
        this.loading.set(false);
        console.error('Error loading repository:', error);
      },
    });
  }

  viewContributor(username: string): void {
    this.router.navigate(['/contributors', username]);
  }

  openRepository(): void {
    if (this.repository()?.url) {
      window.open(this.repository()!.url, '_blank');
    }
  }

  goBack(): void {
    this.router.navigate(['/contributors']);
  }
}

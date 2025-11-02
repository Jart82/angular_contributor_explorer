import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ContributorService } from '../../../core/services/contributor.service';
import { AuthService } from '../../../core/services/auth.service';
import { Contributor } from '../../../core/interface/contributor.interface';

@Component({
  selector: 'app-contributor-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contributor-detail.html',
  styleUrl: './contributor-detail.css',
})
export class ContributorDetail {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contributorService = inject(ContributorService);
  authService = inject(AuthService);

  contributor = signal<Contributor | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  isLiked = signal(false);

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.loadContributor(username);
    }
  }

  loadContributor(username: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.contributorService.getContributorDetails(username).subscribe({
      next: (contributor) => {
        this.contributor.set(contributor as any);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load contributor details');
        this.loading.set(false);
        console.error('Error loading contributor:', error);
      },
    });
  }

  toggleLike(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.contributor()) {
      this.contributorService.likeContributor(this.contributor()!.login).subscribe({
        next: (response) => {
          this.isLiked.set(response.liked);
        },
        error: (error) => {
          console.error('Error toggling like:', error);
        },
      });
    }
  }

  viewRepository(repoName: string): void {
    this.router.navigate(['/repositories', repoName]);
  }

  goBack(): void {
    this.router.navigate(['/contributors']);
  }
}

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
      next: (contributor: Contributor & any) => {
        // If backend returns contributionStats with repositories/contributions,
        // map them to the top-level shape our template expects.
        const cs = (contributor as any).contributionStats;
        if (cs) {
          // map total contributions if missing
          if ((contributor as any).contributions == null && cs.contributions != null) {
            (contributor as any).contributions = cs.contributions;
          }

          // map repositories (attempt a best-effort shape mapping)
          if ((!(contributor as any).repositories || (contributor as any).repositories.length === 0) && Array.isArray(cs.repositories)) {
            (contributor as any).repositories = cs.repositories.map((r: any) => ({
              name: r.name ?? r.repo ?? r.full_name ?? r.repositoryName ?? '',
              contributions: r.contributions ?? r.count ?? 0,
            }));
          }
        }

        // Ensure repositories is always an array to simplify template checks
        if (!contributor.repositories) {
          (contributor as any).repositories = [];
        }

        this.contributor.set(contributor as any);
        this.loading.set(false);
        // Debug log to inspect payload shape while developing
        console.debug('Loaded contributor:', contributor);
      },
      error: (error: any) => {
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
        next: (response: { liked: boolean; likes: string[] }) => {
          this.isLiked.set(response.liked);
        },
        error: (error: any) => {
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

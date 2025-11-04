import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContributorService} from '../../../core/services/contributor.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ContributorQuery } from '../../../core/interface/contributor-query.interface';
import { Contributor } from '../../../core/interface/contributor.interface';
import { PaginatedResponse } from '../../../core/interface/paginated-response.interface';

@Component({
  selector: 'app-contributors-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contributor-list.html',
  styleUrl: './contributor-list.css',
})
export class ContributorListComponent {
  private contributorService = inject(ContributorService);
  private router = inject(Router);

  contributors = signal<Contributor[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  query: ContributorQuery = {
    sortBy: 'contributions',
    sortOrder: 'desc',
    page: 1,
    limit: 20,
  };

  pagination = signal({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  private searchSubject = new Subject<string>();

  sortOptions = [
    { value: 'contributions', label: 'Total Contributions' },
    { value: 'followers', label: 'Followers' },
    { value: 'public_repos', label: 'Public Repositories' },
    { value: 'public_gists', label: 'Public Gists' },
  ];

  ngOnInit(): void {
    this.loadContributors();
    this.setupSearchDebounce();
  }

  setupSearchDebounce(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.query.search = searchTerm;
        this.query.page = 1;
        this.loadContributors();
      });
  }

  loadContributors(): void {
    this.loading.set(true);
    this.error.set(null);

    this.contributorService.getContributors(this.query).subscribe({
      next: (response: PaginatedResponse<Contributor>) => {
        this.contributors.set(response.data);
        this.pagination.set(response.pagination);
        this.loading.set(false);
      },
      error: (error: any) => {
        this.error.set('Failed to load contributors. Please try again.');
        this.loading.set(false);
        console.error('Error loading contributors:', error);
      },
    });
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }

  onSortChange(): void {
    this.query.page = 1;
    this.loadContributors();
  }

  onSortOrderToggle(): void {
    this.query.sortOrder = this.query.sortOrder === 'asc' ? 'desc' : 'asc';
    this.loadContributors();
  }

  onPageChange(page: number): void {
    this.query.page = page;
    this.loadContributors();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewContributor(username: string): void {
    this.router.navigate(['/contributors', username]);
  }
}

export interface ContributorQuery {
  sortBy?: 'contributions' | 'followers' | 'public_repos' | 'public_gists';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  page?: number;
  limit?: number;
}
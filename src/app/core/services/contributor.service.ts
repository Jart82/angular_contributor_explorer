import { Injectable, inject, resource, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ContributorQuery } from '../interface/contributor-query.interface';
import { Contributor } from '../interface/contributor.interface';
import { PaginatedResponse } from '../interface/paginated-response.interface';


@Injectable({
  providedIn: 'root',
})
export class ContributorService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Using HTTP Resource for contributors list
  getContributorsResource(query: ContributorQuery) {
    return resource<PaginatedResponse<Contributor>, ContributorQuery>({
      loader: () => {
        const params = new URLSearchParams();
        if (query.sortBy) params.append('sortBy', query.sortBy);
        if (query.sortOrder) params.append('sortOrder', query.sortOrder);
        if (query.search) params.append('search', query.search);
        if (query.page) params.append('page', query.page.toString());
        if (query.limit) params.append('limit', query.limit.toString());

        return fetch(`${this.apiUrl}/contributors?${params.toString()}`, {
          credentials: 'include',
        }).then(res => res.json());
      },
    });
  }

  // Using HTTP Resource for single contributor
  getContributorDetailsResource(username: string) {
    return resource<Contributor, string>({
      loader: () => {
        return fetch(`${this.apiUrl}/contributors/${username}`, {
          credentials: 'include',
        }).then(res => res.json());
      },
    });
  }
  
  // Convenience HTTP wrappers returning Observables used by components
  getContributors(query: ContributorQuery) {
    let params = new HttpParams();
    if (query.sortBy) params = params.set('sortBy', query.sortBy);
    if (query.sortOrder) params = params.set('sortOrder', query.sortOrder);
    if (query.search) params = params.set('search', query.search);
    if (query.page) params = params.set('page', query.page.toString());
    if (query.limit) params = params.set('limit', query.limit.toString());

    return this.http.get<PaginatedResponse<Contributor>>(`${this.apiUrl}/contributors`, {
      params,
      withCredentials: true,
    });
  }

  getContributorDetails(username: string) {
    return this.http.get<Contributor>(`${this.apiUrl}/contributors/${username}`, {
      withCredentials: true,
    });
  }
  // For mutations, still use HttpClient
  likeContributor(username: string) {
    return this.http.post<{ liked: boolean; likes: string[] }>(
      `${this.apiUrl}/contributors/${username}/like`,
      {},
      { withCredentials: true }
    );
  }

  getUserLikes() {
    return this.http.get<string[]>(
      `${this.apiUrl}/contributors/user/likes`,
      { withCredentials: true }
    );
  }
}
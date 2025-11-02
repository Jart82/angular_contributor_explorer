import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ContributorQuery } from '../interface/contributor-query.interface';
import { PaginatedResponse } from '../interface/paginated-response.interface';
import { Contributor } from '../interface/contributor.interface';


@Injectable({
  providedIn: 'root',
})
export class ContributorService {
  private apiService = inject(ApiService);

  getContributors(query: ContributorQuery): Observable<PaginatedResponse<Contributor>> {
    return this.apiService.get<PaginatedResponse<Contributor>>('contributors', query);
  }

  getContributorDetails(username: string): Observable<Contributor> {
    return this.apiService.get<Contributor>(`contributors/${username}`);
  }

  likeContributor(username: string): Observable<any> {
    return this.apiService.post(`contributors/${username}/like`, {});
  }

  getUserLikes(): Observable<string[]> {
    return this.apiService.get<string[]>('contributors/user/likes');
  }
}

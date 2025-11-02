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
  contributors?: {
    login: string;
    avatar_url: string;
    contributions: number;
    profile_url: string;
  }[];
}
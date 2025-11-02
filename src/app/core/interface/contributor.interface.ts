import { ContributorRepository } from "./contributor-repository.interface";

export interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  followers: number;
  public_repos: number;
  public_gists: number;
  name?: string;
  bio?: string;
  location?: string;
  company?: string;
  repositories: ContributorRepository[];
}
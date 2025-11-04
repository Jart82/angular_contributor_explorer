import { SortByType } from "../type/sort-by.type";
import { SortOrderType } from "../type/sort-order-type";

export interface ContributorQuery {
  sortBy?: SortByType;
  sortOrder?: SortOrderType;
  search?: string;
  page?: number;
  limit?: number;
}
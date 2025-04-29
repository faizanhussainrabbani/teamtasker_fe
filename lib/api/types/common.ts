/**
 * Common API response types
 */

export interface PaginatedResponse<T> {
  // Support both data and items properties
  data?: T[];
  items?: T[];

  // Support both naming conventions for pagination
  total?: number;
  totalCount?: number;

  page?: number;
  pageNumber?: number;

  limit?: number;
  pageSize?: number;

  totalPages?: number;

  // Additional pagination helpers
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
  status: number;
}

export type SortDirection = 'asc' | 'desc';

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}

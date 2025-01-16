// Base class for query parameters with pagination
// Default values will be applied automatically when setting up the global ValidationPipe in main.ts

import { Type } from 'class-transformer';

class PaginationParams {
  // For transformation to number
  @Type(() => Number)
  pageNumber: number = 1;
  @Type(() => Number)
  pageSize: number = 10;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

// Base class for query parameters with sorting and pagination
// The sortBy field must be implemented in the subclasses
export abstract class BaseSortablePaginationParams<T> extends PaginationParams {
  sortDirection: SortDirection = SortDirection.Desc;
  abstract sortBy: T;
}

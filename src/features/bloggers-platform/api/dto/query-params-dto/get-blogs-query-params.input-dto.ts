import { BaseSortablePaginationParams } from 'src/core/dto/base.query-params.input-dto';

export enum BlogsSortBy {
  CreatedAt = 'createdAt',
  Name = 'name',
}

// DTO for a query for a list of users with pagination, sorting, and filtering
export class GetBlogsQueryParams extends BaseSortablePaginationParams<BlogsSortBy> {
  sortBy = BlogsSortBy.CreatedAt;
  searchNameTerm: string | null = null;
}

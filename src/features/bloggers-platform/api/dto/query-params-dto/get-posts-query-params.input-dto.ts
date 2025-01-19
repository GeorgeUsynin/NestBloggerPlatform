import { BaseSortablePaginationParams } from 'src/core/dto/base.query-params.input-dto';

export enum PostsSortBy {
  CreatedAt = 'createdAt',
  Title = 'title',
  BlogName = 'blogName',
}

// DTO for a query for a list of users with pagination, sorting, and filtering
export class GetPostsQueryParams extends BaseSortablePaginationParams<PostsSortBy> {
  sortBy = PostsSortBy.CreatedAt;
}

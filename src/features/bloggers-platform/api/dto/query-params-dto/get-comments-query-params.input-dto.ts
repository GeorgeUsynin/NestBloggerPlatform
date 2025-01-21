import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';

export enum CommentsSortBy {
  CreatedAt = 'createdAt',
}

// DTO for a query for a list of comments with pagination, sorting, and filtering
export class GetCommentsQueryParams extends BaseSortablePaginationParams<CommentsSortBy> {
  sortBy = CommentsSortBy.CreatedAt;
}

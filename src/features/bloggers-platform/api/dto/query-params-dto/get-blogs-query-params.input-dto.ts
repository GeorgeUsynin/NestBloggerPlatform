import { ApiProperty } from '@nestjs/swagger';
import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';

export enum BlogsSortBy {
  CreatedAt = 'createdAt',
  Name = 'name',
}

// DTO for a query for a list of blogs with pagination, sorting, and filtering
export class GetBlogsQueryParams extends BaseSortablePaginationParams<BlogsSortBy> {
  @ApiProperty({ enum: BlogsSortBy })
  sortBy = BlogsSortBy.CreatedAt;

  @ApiProperty({
    type: String,
    description:
      'Search term for blog Name: Name should contains this term in any position',
    required: false,
  })
  searchNameTerm: string | null = null;
}

import { ApiProperty } from '@nestjs/swagger';

// Base class for view models for queries for a list with pagination
export abstract class PaginatedViewDto<T> {
  @ApiProperty({ type: Number, default: 0 })
  totalCount: number;

  @ApiProperty({ type: Number, default: 0 })
  pagesCount: number;

  @ApiProperty({ type: Number, default: 0 })
  page: number;

  @ApiProperty({ type: Number, default: 0 })
  pageSize: number;

  @ApiProperty()
  abstract items: T;

  // Static utility method for mapping
  public static mapToView<T>(data: {
    items: T;
    page: number;
    size: number;
    totalCount: number;
  }): PaginatedViewDto<T> {
    return {
      totalCount: data.totalCount,
      pagesCount: Math.ceil(data.totalCount / data.size),
      page: data.page,
      pageSize: data.size,
      items: data.items,
    };
  }
}

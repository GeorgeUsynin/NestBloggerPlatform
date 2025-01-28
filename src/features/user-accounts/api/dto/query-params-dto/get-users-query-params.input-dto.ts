import { IsStringWithMessage } from '../../../../../core/decorators/validation';
import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional } from 'class-validator';

export enum UsersSortBy {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}

// DTO for a query for a list of users with pagination, sorting, and filtering
export class GetUsersQueryParams extends BaseSortablePaginationParams<UsersSortBy> {
  @IsEnum(UsersSortBy)
  sortBy = UsersSortBy.CreatedAt;

  @IsStringWithMessage()
  @IsOptional()
  searchLoginTerm: string | null = null;

  @IsStringWithMessage()
  @IsOptional()
  searchEmailTerm: string | null = null;
}

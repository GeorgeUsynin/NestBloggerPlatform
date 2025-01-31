import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../../core/decorators/swagger/ApiPaginatedResponse.decorator';
import { PostViewDto } from '../dto/view-dto/posts.view-dto';

export const GetAllPostsApi = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Returns all posts for specified blog' }),
    ApiPaginatedResponse(PostViewDto),
    ApiNotFoundResponse({
      description: 'If specified blog is not exists',
    }),
  );
};

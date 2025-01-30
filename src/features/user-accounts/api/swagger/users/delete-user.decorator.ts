import { applyDecorators } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const DeleteUserApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete user specified by id',
    }),
    ApiNoContentResponse({
      description: 'No Content',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiNotFoundResponse({
      description: 'If specified user is not exists',
    }),
  );
};

import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UserViewDto } from '../../dto/view-dto/user.view-dto';

export const GetUserApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Returns user by id',
    }),
    ApiOkResponse({
      type: UserViewDto,
      description: 'Success',
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
    }),
  );
};

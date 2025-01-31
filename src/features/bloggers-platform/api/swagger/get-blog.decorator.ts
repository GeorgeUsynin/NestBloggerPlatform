import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { BlogViewDto } from '../dto/view-dto/blogs.view-dto';

export const GetBlogApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Returns blog by id',
    }),
    ApiOkResponse({
      description: 'Success',
      type: BlogViewDto,
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
    }),
  );
};

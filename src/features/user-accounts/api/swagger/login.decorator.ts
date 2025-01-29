import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginSuccessViewDto } from '../dto/view-dto/login-success.view-dto';
import { SwaggerErrorsMessagesViewDto } from '../../../../core/dto/swagger-errors-messages.view-dto';

class SwaggerLoginInputDto {
  loginOrEmail: string;
  password: string;
}

class SwaggerLoginSuccessViewDto implements LoginSuccessViewDto {
  @ApiProperty({ type: String, description: 'JWT access token' })
  accessToken: string;
}

export const LoginApi = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Try login user to the system' }),
    ApiBody({ type: SwaggerLoginInputDto, required: false }),
    ApiOkResponse({
      description:
        'Returns JWT accessToken (expired after 10 minutes) in body.',
      type: SwaggerLoginSuccessViewDto,
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      type: SwaggerErrorsMessagesViewDto,
    }),
    ApiUnauthorizedResponse({
      description: 'If the password or login or email is wrong',
    }),
  );
};

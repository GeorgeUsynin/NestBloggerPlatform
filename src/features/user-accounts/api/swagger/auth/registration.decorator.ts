import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiProperty,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { SwaggerErrorsMessagesViewDto } from '../../../../../core/dto/swagger-errors-messages.view-dto';
import { CreateUserInputDto } from '../../dto/input-dto/create/users.input-dto';

export class SwaggerCreateUserInputDto implements CreateUserInputDto {
  @ApiProperty({
    type: String,
    maxLength: 10,
    minLength: 3,
    pattern: '^[a-zA-Z0-9_-]*$',
    description: 'must be unique',
  })
  login: string;

  @ApiProperty({
    type: String,
    maxLength: 20,
    minLength: 6,
  })
  password: string;

  @ApiProperty({
    type: String,
    pattern: '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
    example: 'example@example.com',
    description: 'must be unique',
  })
  email: string;
}

export const RegistrationApi = () => {
  return applyDecorators(
    ApiOperation({
      summary:
        'Registration in the system. Email with confirmation code will be send to passed email address',
    }),
    ApiBody({ type: SwaggerCreateUserInputDto, required: false }),
    ApiNoContentResponse({
      description:
        'Input data is accepted. Email with confirmation code will be send to passed email address',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      type: SwaggerErrorsMessagesViewDto,
    }),
    ApiTooManyRequestsResponse({
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
};

import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiProperty,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { SwaggerErrorsMessagesViewDto } from '../../../../core/dto/swagger-errors-messages.view-dto';
import { PasswordRecoveryInputDto } from '../dto/input-dto/password-recovery.input-dto';

class SwaggerPasswordRecoveryInputDto implements PasswordRecoveryInputDto {
  @ApiProperty({
    type: String,
    pattern: '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
    example: 'example@example.com',
    description: 'Email of registered user',
  })
  email: string;
}

export const PasswordRecoveryApi = () => {
  return applyDecorators(
    ApiOperation({
      summary:
        'Password recovery via Email confirmation. Email should be sent with RecoveryCode inside',
    }),
    ApiBody({ type: SwaggerPasswordRecoveryInputDto, required: false }),
    ApiNoContentResponse({
      description:
        "Even if current email is not registered (for prevent user's email detection)",
    }),
    ApiBadRequestResponse({
      description:
        'If the inputModel has invalid email (for example 222^gmail.com)',
      type: SwaggerErrorsMessagesViewDto,
    }),
    ApiTooManyRequestsResponse({
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
};

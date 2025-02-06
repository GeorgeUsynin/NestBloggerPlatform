import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ENV_VARIABLE_NAMES } from '../../../constants';
import { configValidationUtility } from '../../../setup/config-validation.utility';

@Injectable()
export class UserAccountsConfig {
  @IsNumber(
    {},
    {
      message:
        'Set Env variable CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS, example: 1',
    },
  )
  @IsNotEmpty({
    message:
      'Set Env variable CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS, example: 1',
  })
  [ENV_VARIABLE_NAMES.CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS]: number =
    Number(
      this.configService.get(
        ENV_VARIABLE_NAMES.CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS,
      ),
    );

  @IsNotEmpty({
    message: 'Set Env variable ACCESS_TOKEN_EXPIRATION_TIME, example: 1',
  })
  [ENV_VARIABLE_NAMES.ACCESS_TOKEN_EXPIRATION_TIME]: string =
    this.configService.get(
      ENV_VARIABLE_NAMES.ACCESS_TOKEN_EXPIRATION_TIME,
    ) as string;

  @IsNotEmpty({
    message: 'Set Env variable JWT_SECRET, example: your-secret',
  })
  [ENV_VARIABLE_NAMES.JWT_SECRET]: string = this.configService.get(
    ENV_VARIABLE_NAMES.JWT_SECRET,
  ) as string;

  constructor(private configService: ConfigService) {
    configValidationUtility.validateConfig(this);
  }
}

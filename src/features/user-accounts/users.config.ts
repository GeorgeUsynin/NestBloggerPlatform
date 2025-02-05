import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_VARIABLE_NAMES } from 'src/constants';

@Injectable()
export class UsersConfig {
  constructor(private configService: ConfigService) {}

  [ENV_VARIABLE_NAMES.AUTH_CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS]: number =
    this.configService.get(
      ENV_VARIABLE_NAMES.AUTH_CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS,
    );
}

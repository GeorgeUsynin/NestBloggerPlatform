import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_VARIABLE_NAMES } from 'src/constants';

@Injectable()
export class AppConfig {
  constructor(private configService: ConfigService) {}

  [ENV_VARIABLE_NAMES.PORT]: number = this.configService.get(
    ENV_VARIABLE_NAMES.PORT,
  );

  [ENV_VARIABLE_NAMES.NODE_ENV]: string = this.configService.get(
    ENV_VARIABLE_NAMES.NODE_ENV,
  );

  [ENV_VARIABLE_NAMES.SERVER_URL]: string = this.configService.get(
    ENV_VARIABLE_NAMES.SERVER_URL,
  );

  [ENV_VARIABLE_NAMES.MONGO_URL]: string = this.configService.get(
    ENV_VARIABLE_NAMES.MONGO_URL,
  );

  [ENV_VARIABLE_NAMES.DB_NAME]: string = this.configService.get(
    ENV_VARIABLE_NAMES.DB_NAME,
  );
}

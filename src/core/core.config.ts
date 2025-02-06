import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ENV_VARIABLE_NAMES, ENVIRONMENTS } from '../constants';
import { configValidationUtility } from '../setup/config-validation.utility';

@Injectable()
export class CoreConfig {
  @IsNumber(
    {},
    {
      message: 'Set Env variable PORT, example: 3000',
    },
  )
  [ENV_VARIABLE_NAMES.PORT]: number = Number(
    this.configService.get(ENV_VARIABLE_NAMES.PORT),
  );

  @IsEnum(ENVIRONMENTS, {
    message:
      'Ser correct NODE_ENV value, available values: ' +
      configValidationUtility.getEnumValues(ENVIRONMENTS).join(', '),
  })
  [ENV_VARIABLE_NAMES.NODE_ENV]: string = this.configService.get(
    ENV_VARIABLE_NAMES.NODE_ENV,
  ) as string;

  @IsNotEmpty({
    message: 'Set Env variable SERVER_URL, example: http://localhost:PORT',
  })
  [ENV_VARIABLE_NAMES.SERVER_URL]: string = this.configService.get(
    ENV_VARIABLE_NAMES.SERVER_URL,
  ) as string;

  @IsNotEmpty({
    message:
      'Set Env variable MONGO_URL, example: mongodb://localhost:27017/my-app-local-db',
  })
  [ENV_VARIABLE_NAMES.MONGO_URL]: string = this.configService.get(
    ENV_VARIABLE_NAMES.MONGO_URL,
  ) as string;

  @IsNotEmpty({
    message: 'Set Env variable DB_NAME, example: database-name',
  })
  [ENV_VARIABLE_NAMES.DB_NAME]: string = this.configService.get(
    ENV_VARIABLE_NAMES.DB_NAME,
  ) as string;

  // @IsBoolean({
  //   message:
  //     'Set Env variable IS_SWAGGER_ENABLED to enable/disable Swagger, example: true, available values: true, false',
  // })
  // isSwaggerEnabled = configValidationUtility.convertToBoolean(
  //   this.configService.get('IS_SWAGGER_ENABLED'),
  // ) as boolean;

  // @IsBoolean({
  //   message:
  //     'Set Env variable INCLUDE_TESTING_MODULE to enable/disable Dangerous for production TestingModule, example: true, available values: true, false, 0, 1',
  // })
  // includeTestingModule: boolean = configValidationUtility.convertToBoolean(
  //   this.configService.get('INCLUDE_TESTING_MODULE'),
  // ) as boolean;

  constructor(private configService: ConfigService) {
    configValidationUtility.validateConfig(this);
  }
}

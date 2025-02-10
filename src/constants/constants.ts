export const GLOBAL_PREFIX = '/api';

export const ENV_VARIABLE_NAMES = {
  ACCESS_TOKEN_EXPIRATION_TIME: 'ACCESS_TOKEN_EXPIRATION_TIME',
  CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS:
    'CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS',
  DB_NAME: 'DB_NAME',
  EMAIL_BLOG_PLATFORM: 'EMAIL_BLOG_PLATFORM',
  EMAIL_BLOG_PLATFORM_PASSWORD: 'EMAIL_BLOG_PLATFORM_PASSWORD',
  INCLUDE_TESTING_MODULE: 'INCLUDE_TESTING_MODULE',
  IS_SWAGGER_ENABLED: 'IS_SWAGGER_ENABLED',
  IS_USER_AUTOMATICALLY_CONFIRMED: 'IS_USER_AUTOMATICALLY_CONFIRMED',
  JWT_SECRET: 'JWT_SECRET',
  LOGIN: 'LOGIN',
  MONGO_URL: 'MONGO_URL',
  NODE_ENV: 'NODE_ENV',
  PASSWORD: 'PASSWORD',
  PORT: 'PORT',
  RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS:
    'RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS',
  SERVER_URL: 'SERVER_URL',
} as const;

export enum ENVIRONMENTS {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

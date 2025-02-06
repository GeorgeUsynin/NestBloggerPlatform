import { ConfigModule } from '@nestjs/config';

// We must import this configModule at the top level of our app.module.ts
export const configModule = ConfigModule.forRoot({
  envFilePath: [
    // process.env.ENV_FILE_PATH?.trim() || '', - to override env variables using path to the new env file from where the app will be running
    `.env.${process.env.NODE_ENV}.local`,
    `.env.${process.env.NODE_ENV}`,
    '.env.production',
  ],
  isGlobal: true,
});

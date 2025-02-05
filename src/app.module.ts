// Option: 1
// Config module must be on the top of imports because it will initialize env variables when app is running for the first time
import { configModule } from './setup/config-module';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { UsersAccountsModule } from './features/user-accounts/usersAccounts.module';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './features/testing/testing.module';
import { CoreModule } from './core/core.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppConfig } from './app.config';

@Module({
  imports: [
    // Load environment variables
    configModule,
    // Serve static files from swagger-static folder
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/api',
    }),
    // Connect to MongoDB
    MongooseModule.forRootAsync({
      imports: [AppConfig],
      useFactory: (appConfig: AppConfig) => ({
        uri: appConfig.MONGO_URL,
        dbName: appConfig.DB_NAME,
      }),
      inject: [AppConfig],
    }),
    CoreModule,
    UsersAccountsModule,
    BloggersPlatformModule,
    TestingModule,
  ],
  controllers: [AppController],
  providers: [AppConfig],
})
export class AppModule {}

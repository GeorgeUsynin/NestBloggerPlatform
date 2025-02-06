// Option: 1
// Config module must be on the top of imports because it will initialize env variables when app is running for the first time
import { configModule } from './config-module';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { UsersAccountsModule } from './features/user-accounts/usersAccounts.module';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './features/testing/testing.module';
import { CoreModule } from './core/core.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ENVIRONMENTS } from './constants';
import { CoreConfig } from './core/core.config';
import { join } from 'path';

@Module({
  imports: [
    // Serve static files from swagger-static folder
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot:
        process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT ? '/' : '/api',
    }),
    // Connect to MongoDB
    MongooseModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => ({
        uri: coreConfig.MONGO_URL,
        dbName: coreConfig.DB_NAME,
      }),
      inject: [CoreConfig],
    }),
    CoreModule,
    UsersAccountsModule,
    BloggersPlatformModule,
    TestingModule,
    // Load environment variables
    configModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

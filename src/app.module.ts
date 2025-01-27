import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { UsersAccountsModule } from './features/user-accounts/usersAccounts.module';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './features/testing/testing.module';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import { DB_NAME } from './constants';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // Serve static files from swagger-static folder
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/api',
    }),
    // Load environment variables
    ConfigModule.forRoot(),
    // Connect to MongoDB
    MongooseModule.forRoot('mongodb://localhost', {
      dbName: DB_NAME,
    }),
    CoreModule,
    UsersAccountsModule,
    BloggersPlatformModule,
    TestingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

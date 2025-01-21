import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { UsersAccountsModule } from './features/user-accounts/usersAccounts.module';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './features/testing/testing.module';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import { DB_NAME } from './constants/constants';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/api',
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL!, {
      dbName: DB_NAME,
    }),
    TestingModule,
    UsersAccountsModule,
    BloggersPlatformModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

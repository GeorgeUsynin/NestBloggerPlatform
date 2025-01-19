import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAccountsModule } from './features/user-accounts/usersAccounts.module';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';

@Module({
  imports: [
    MongooseModule.forRoot(''),
    UsersAccountsModule,
    BloggersPlatformModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAccountsModule } from './features/user-accounts/usersAccounts.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      '',
    ),
    UsersAccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

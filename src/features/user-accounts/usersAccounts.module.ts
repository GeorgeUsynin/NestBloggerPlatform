import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UserSchema, User } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/users.query-repository';

@Module({
  // This will allow injecting the UserModel into the providers in this module
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository],
  exports: [MongooseModule],
  /* We re-export the MongooseModule if we want the models registered here to be injectable 
  into the services of other modules that import this module */
})
export class UsersAccountsModule {}

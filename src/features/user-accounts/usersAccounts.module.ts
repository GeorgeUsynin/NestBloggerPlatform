import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UserSchema, User } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { AuthService } from './application/auth.service';
import { RegistrationService } from './application/registration.service';
import { CryptoService } from './application/crypto.service';
import { PasswordService } from './application/password.service';
import { AuthController } from './api/auth.controller';
import { NotificationsModule } from '../notification/notification.module';
import { LocalStrategy } from './guards/local/local.strategy';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import { UserAccountsConfig } from './config';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from './constants/constants';

@Module({
  // This will allow injecting the UserModel into the providers in this module
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
    NotificationsModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.JWT_SECRET,
          signOptions: {
            expiresIn: userAccountConfig.ACCESS_TOKEN_EXPIRATION_TIME,
          },
        });
      },
      inject: [UserAccountsConfig],
    },
    AuthService,
    CryptoService,
    RegistrationService,
    UsersService,
    PasswordService,
    UsersRepository,
    UsersQueryRepository,
    AuthQueryRepository,
    LocalStrategy,
    JwtStrategy,
    UserAccountsConfig,
  ],
  exports: [MongooseModule],
  /* We re-export the MongooseModule if we want the models registered here to be injectable 
  into the services of other modules that import this module */
})
export class UsersAccountsModule {}

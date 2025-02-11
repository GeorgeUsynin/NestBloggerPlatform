import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './api/users.controller';
import { UserSchema, User } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { AuthService } from './application/auth.service';
import { RegistrationService } from './application/registration.service';
import { CryptoService } from './application/crypto.service';
import { AuthController } from './api/auth.controller';
import { LocalStrategy } from './guards/local/local.strategy';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import { UserAccountsConfig } from './config';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants';
import {
  ChangePasswordUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  LoginUseCase,
  RecoverPasswordUseCase,
  RegisterUserUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
} from './application/use-cases';

const useCases = [
  CreateUserUseCase,
  DeleteUserUseCase,
  RegisterUserUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  ChangePasswordUseCase,
  RecoverPasswordUseCase,
  LoginUseCase,
];
const strategies = [LocalStrategy, JwtStrategy];
const queryRepositories = [UsersQueryRepository, AuthQueryRepository];
const services = [AuthService, CryptoService, RegistrationService];

@Module({
  // This will allow injecting the UserModel into the providers in this module
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
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
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.JWT_SECRET,
          signOptions: {
            expiresIn: userAccountConfig.REFRESH_TOKEN_EXPIRATION_TIME,
          },
        });
      },
      inject: [UserAccountsConfig],
    },
    UsersRepository,
    UserAccountsConfig,
    ...queryRepositories,
    ...services,
    ...strategies,
    ...useCases,
  ],
  exports: [MongooseModule, UsersRepository],
  /* We re-export the MongooseModule if we want the models registered here to be injectable 
  into the services of other modules that import this module */
})
export class UsersAccountsModule {}

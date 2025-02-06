import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { add } from 'date-fns/add';
import { randomUUID } from 'node:crypto';
import { CryptoService } from './crypto.service';
import { CreateUserDto } from '../domain/dto/create/users.create-dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { BadRequestDomainException } from '../../../core/exceptions/domain-exceptions';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { EmailManager } from '../../notification/email.manager';
import { UserAccountsConfig } from '../config';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private cryptoService: CryptoService,
    private usersRepository: UsersRepository,
    private emailManager: EmailManager,
    private usersConfig: UserAccountsConfig,
  ) {}

  async registerUser(payload: CreateUserDto): Promise<void> {
    const { login, email, password } = payload;

    // check if user already exists
    const userWithLogin = await this.usersRepository.findUserByLogin(login);
    const userWithEmail = await this.usersRepository.findUserByEmail(email);

    if (userWithLogin || userWithEmail) {
      const message = `User with this ${userWithLogin ? 'login' : 'email'} already exists`;
      const field = userWithLogin ? 'login' : 'email';

      throw BadRequestDomainException.create(message, field);
    }

    // hash password
    const passwordHash =
      await this.cryptoService.generatePasswordHash(password);

    // create new user
    const newUser = this.UserModel.createUnconfirmedUser({
      login,
      email,
      password: passwordHash,
    });

    if (this.usersConfig.IS_USER_AUTOMATICALLY_CONFIRMED) {
      newUser.emailConfirmation.isConfirmed = true;
      this.usersRepository.save(newUser);
    } else {
      await this.sendEmailConfirmationCode(newUser, email);
    }
  }

  async registrationConfirmation(code: string): Promise<void> {
    const user =
      await this.usersRepository.findUserByConfirmationEmailCode(code);

    if (!user) {
      throw BadRequestDomainException.create('Invalid code', 'code');
    }

    user.confirmUserEmail(code);

    await this.usersRepository.save(user);
  }

  async registrationEmailResending(email: string): Promise<void> {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      throw BadRequestDomainException.create(
        'User with this email not found',
        'email',
      );
    }

    await this.sendEmailConfirmationCode(user, email);
  }

  private async sendEmailConfirmationCode(user: UserDocument, email: string) {
    const confirmationCode = randomUUID();
    const expirationTimeInHours =
      this.usersConfig.CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS;
    const expirationDate = add(new Date(), { hours: expirationTimeInHours });

    user.setConfirmationCode(confirmationCode, expirationDate);

    await this.usersRepository.save(user);

    // sent confirmation email
    this.emailManager.sendPasswordConfirmationEmail(email, confirmationCode);
  }
}

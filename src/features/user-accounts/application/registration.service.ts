import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from '../domain/dto/create/users.create-dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { BadRequestDomainException } from '../../../core/exceptions/domain-exceptions';
import { CryptoService } from './crypto.service';
import { User, UserModelType } from '../domain/user.entity';
import { EmailManager } from '../../notification/email.manager';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private cryptoService: CryptoService,
    private usersRepository: UsersRepository,
    private emailManager: EmailManager,
  ) {}

  async registerUser(payload: CreateUserDto) {
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

    const confirmationCode = randomUUID();

    newUser.setConfirmationCode(confirmationCode);

    await this.usersRepository.save(newUser);

    // sent confirmation email
    this.emailManager.sendPasswordConfirmationEmail(email, confirmationCode);
  }
}

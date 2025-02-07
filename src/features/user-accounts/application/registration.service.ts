import { Injectable } from '@nestjs/common';
import { add } from 'date-fns/add';
import { randomUUID } from 'node:crypto';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserDocument } from '../domain/user.entity';
import { EmailManager } from '../../notification/email.manager';
import { UserAccountsConfig } from '../config';

@Injectable()
export class RegistrationService {
  constructor(
    private usersRepository: UsersRepository,
    private emailManager: EmailManager,
    private usersConfig: UserAccountsConfig,
  ) {}

  async sendEmailConfirmationCode(user: UserDocument, email: string) {
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

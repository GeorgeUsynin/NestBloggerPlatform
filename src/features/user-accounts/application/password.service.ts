import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { EmailManager } from '../../notification/email.manager';
import { CryptoService } from './crypto.service';
import { randomUUID } from 'node:crypto';
import { BadRequestDomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class PasswordService {
  constructor(
    private cryptoService: CryptoService,
    private usersRepository: UsersRepository,
    private emailManager: EmailManager,
  ) {}

  async recoverPassword(email: string) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) return;

    const passwordRecoveryCode = randomUUID();

    user.setPasswordRecoveryCode(passwordRecoveryCode);

    await this.usersRepository.save(user);

    // sent confirmation email
    this.emailManager.sendPasswordRecoveryEmail(email, passwordRecoveryCode);
  }

  async changePassword(newPassword: string, recoveryCode: string) {
    const user =
      await this.usersRepository.findUserByRecoveryPasswordCode(recoveryCode);

    if (!user) {
      throw BadRequestDomainException.create('Invalid code', 'recoveryCode');
    }

    const passwordHash =
      await this.cryptoService.generatePasswordHash(newPassword);

    user.changePassword(recoveryCode, passwordHash);

    await this.usersRepository.save(user);
  }
}

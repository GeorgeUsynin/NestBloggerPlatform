import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { UsersRepository } from '../../infrastructure/users.repository';
import { EmailManager } from '../../../../features/notification/email.manager';

export class RecoverPasswordCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(RecoverPasswordCommand)
export class RecoverPasswordUseCase
  implements ICommandHandler<RecoverPasswordCommand, void>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailManager: EmailManager,
  ) {}

  async execute({ email }: RecoverPasswordCommand) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) return;

    const passwordRecoveryCode = randomUUID();

    user.setPasswordRecoveryCode(passwordRecoveryCode);

    await this.usersRepository.save(user);

    // sent confirmation email
    this.emailManager.sendPasswordRecoveryEmail(email, passwordRecoveryCode);
  }
}

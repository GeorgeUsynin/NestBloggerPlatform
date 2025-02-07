import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginSuccessViewDto } from '../../api/dto/view-dto/login-success.view-dto';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from '../../constants';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';

export class LoginCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase
  implements ICommandHandler<LoginCommand, LoginSuccessViewDto>
{
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,
  ) {}

  async execute({ userId }: LoginCommand) {
    const payload = { id: userId };
    const accessToken = this.accessTokenContext.sign(payload);

    return { accessToken };
  }
}

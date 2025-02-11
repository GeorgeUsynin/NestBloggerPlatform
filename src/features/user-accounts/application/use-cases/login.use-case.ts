import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../constants';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';

export class LoginCommand {
  constructor(public readonly userId: string) {}
}

export class LoginUseCaseResponse {
  accessToken: string;
  refreshToken: string;
}

@CommandHandler(LoginCommand)
export class LoginUseCase
  implements ICommandHandler<LoginCommand, LoginUseCaseResponse>
{
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private refreshTokenContext: JwtService,
  ) {}

  async execute({ userId }: LoginCommand) {
    const payload = { id: userId };
    const accessToken = this.accessTokenContext.sign(payload);
    const refreshToken = this.refreshTokenContext.sign(payload);

    return { accessToken, refreshToken };
  }
}

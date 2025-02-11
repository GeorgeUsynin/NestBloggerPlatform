import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { ExtractUserFromRequest } from '../guards/decorators/params/ExtractUserFromRequest.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { CreateUserInputDto } from './dto/input-dto/create/users.input-dto';
import { RegistrationConfirmationInputDto } from './dto/input-dto/registration-confirmation.input-dto';
import { RegistrationEmailResendingInputDto } from './dto/input-dto/registration-email-resending.input-dto';
import { PasswordRecoveryInputDto } from './dto/input-dto/password-recovery.input-dto';
import { NewPasswordInputDto } from './dto/input-dto/new-password.input-dto';
import { MeViewDto } from './dto/view-dto/user.view-dto';
import { LoginSuccessViewDto } from './dto/view-dto/login-success.view-dto';
import { AuthQueryRepository } from '../infrastructure/query/auth.query-repository';
import {
  LoginApi,
  MeApi,
  PasswordRecoveryApi,
  RegistrationApi,
  RegistrationConfirmationApi,
  RegistrationEmailResendingApi,
} from './swagger';
import { NewPasswordApi } from './swagger/auth/new-password.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  ChangePasswordCommand,
  LoginCommand,
  LoginUseCaseResponse,
  RecoverPasswordCommand,
  RegisterUserCommand,
  RegistrationConfirmationCommand,
  RegistrationEmailResendingCommand,
} from '../application/use-cases';

@Controller('auth')
export class AuthController {
  constructor(
    private authQueryRepository: AuthQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @MeApi()
  async me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
    return this.authQueryRepository.me(user.id);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginApi()
  async login(
    @Res({ passthrough: true }) response: Response,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<LoginSuccessViewDto> {
    const { accessToken, refreshToken } = await this.commandBus.execute<
      LoginCommand,
      LoginUseCaseResponse
    >(new LoginCommand(user.id));

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken };
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RegistrationApi()
  async registration(@Body() body: CreateUserInputDto): Promise<void> {
    return this.commandBus.execute(new RegisterUserCommand(body));
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RegistrationConfirmationApi()
  async registrationConfirmation(
    @Body() body: RegistrationConfirmationInputDto,
  ): Promise<void> {
    const { code } = body;

    return this.commandBus.execute(new RegistrationConfirmationCommand(code));
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RegistrationEmailResendingApi()
  async registrationEmailResending(
    @Body() body: RegistrationEmailResendingInputDto,
  ): Promise<void> {
    const { email } = body;

    return this.commandBus.execute(
      new RegistrationEmailResendingCommand(email),
    );
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @PasswordRecoveryApi()
  async passwordRecovery(
    @Body() body: PasswordRecoveryInputDto,
  ): Promise<void> {
    const { email } = body;

    return this.commandBus.execute(new RecoverPasswordCommand(email));
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @NewPasswordApi()
  async newPassword(@Body() body: NewPasswordInputDto): Promise<void> {
    const { newPassword, recoveryCode } = body;

    return this.commandBus.execute(
      new ChangePasswordCommand(newPassword, recoveryCode),
    );
  }
}

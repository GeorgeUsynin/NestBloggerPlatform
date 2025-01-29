import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ExtractUserFromRequest } from '../guards/decorators/params/ExtractUserFromRequest.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { RegistrationService } from '../application/registration.service';
import { AuthQueryRepository } from '../infrastructure/query/auth.query-repository';
import { CreateUserInputDto } from './dto/input-dto/create/users.input-dto';
import { RegistrationConfirmationInputDto } from './dto/input-dto/registration-confirmation.input-dto';
import { RegistrationEmailResendingInputDto } from './dto/input-dto/registration-email-resending.input-dto';
import { PasswordRecoveryInputDto } from './dto/input-dto/password-recovery.input-dto';
import { PasswordService } from '../application/password.service';
import { NewPasswordInputDto } from './dto/input-dto/new-password.input-dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { MeViewDto } from './dto/view-dto/user.view-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private registrationService: RegistrationService,
    private passwordService: PasswordService,
    private authQueryRepository: AuthQueryRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
    return this.authQueryRepository.me(user.id);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@ExtractUserFromRequest() user: UserContextDto): Promise<{
    accessToken: string;
  }> {
    const accessToken = await this.authService.login(user.id);

    return accessToken;
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() body: CreateUserInputDto): Promise<void> {
    await this.registrationService.registerUser(body);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(
    @Body() body: RegistrationConfirmationInputDto,
  ): Promise<void> {
    const { code } = body;

    await this.registrationService.registrationConfirmation(code);
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() body: RegistrationEmailResendingInputDto,
  ): Promise<void> {
    const { email } = body;

    await this.registrationService.registrationEmailResending(email);
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(
    @Body() body: PasswordRecoveryInputDto,
  ): Promise<void> {
    const { email } = body;

    await this.passwordService.recoverPassword(email);
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() body: NewPasswordInputDto): Promise<void> {
    const { newPassword, recoveryCode } = body;

    await this.passwordService.changePassword(newPassword, recoveryCode);
  }
}

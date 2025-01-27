import {
  Controller,
  // Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ExtractUserFromRequest } from '../guards/decorators/params/ExtractUserFromRequest.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
// import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@ExtractUserFromRequest() user: UserContextDto) {
    const accessToken = await this.authService.login(user.id);

    return accessToken;
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@ExtractUserFromRequest() user: UserContextDto) {
  //   return user;
  // }
}

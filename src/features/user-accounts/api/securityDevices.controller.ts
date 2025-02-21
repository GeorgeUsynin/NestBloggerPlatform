import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtCookieAuthGuard } from '../guards/bearer/jwt-cookie-auth.guard';
import { RefreshTokenContextDto } from '../guards/dto/refresh-token-context.dto';
import { ExtractUserFromRequest } from '../guards/decorators/params/ExtractUserFromRequest.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { AuthDeviceSessionViewDto } from './dto/view-dto/authDeviceSession.view-dto';
import { AuthDeviceSessionQueryRepository } from '../infrastructure/query/authDeviceSessions.query-repository';

@Controller('security')
export class SecurityDevicesController {
  constructor(
    private authDeviceSessionQueryRepository: AuthDeviceSessionQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtCookieAuthGuard)
  @Get('devices')
  @HttpCode(HttpStatus.OK)
  // TODO: add swagger
  async getAllAuthDeviceSessions(
    @ExtractUserFromRequest() user: RefreshTokenContextDto,
  ): Promise<AuthDeviceSessionViewDto[]> {
    return this.authDeviceSessionQueryRepository.getAllUserAuthDeviceSessions(
      user.id,
    );
  }
}

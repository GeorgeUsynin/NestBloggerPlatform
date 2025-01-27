import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorizationHeader = request.headers.authorization;

    // https://docs.nestjs.com/security/authentication#enable-authentication-globally
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
      throw UnauthorizedDomainException.create();
    }

    const base64Credentials = authorizationHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf-8',
    );
    const [login, password] = credentials.split(':');

    if (login === process.env.LOGIN && password === process.env.PASSWORD) {
      return true;
    } else {
      throw UnauthorizedDomainException.create();
    }
  }
}

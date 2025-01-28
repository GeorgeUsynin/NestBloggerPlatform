import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../infrastructure/users.repository';
import { CryptoService } from './crypto.service';
import { UserContextDto } from '../guards/dto/user-context.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserContextDto | null> {
    const user =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return null;
    }

    const isValidPassword = await this.cryptoService.comparePassword(
      password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      return null;
    }

    return { id: user._id.toString() };
  }

  async login(userId: string): Promise<{
    access_token: string;
  }> {
    const payload = { id: userId };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
    };
  }
}

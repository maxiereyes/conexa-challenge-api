import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRolesEnum } from '../user/enum/user-roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private hashData(data: string) {
    return argon2.hash(data);
  }

  private async getTokens(
    userId: string,
    email: string,
    roles: UserRolesEnum[],
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          roles,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          roles,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '30d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async register(payload: RegisterUserDto) {
    const user = await this.userService.findByEmail(payload.email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const hash = await this.hashData(payload.password);

    const newUser = await this.userService.create({
      ...payload,
      password: hash,
    });

    const { accessToken, refreshToken } = await this.getTokens(
      newUser.id,
      newUser.email,
      newUser.roles,
    );

    await this.updateRefreshToken(newUser.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(payload: LoginUserDto) {
    const user = await this.userService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordIsCorrect = await argon2.verify(
      user.password,
      payload.password,
    );

    if (!passwordIsCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.getTokens(
      user.id,
      user.email,
      user.roles,
    );

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    return this.userService.update(userId, { refreshToken: null });
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findByIdWithRefreshToken(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const isTokenMatch = await argon2.verify(user.refreshToken, refreshToken);

    if (!isTokenMatch) {
      throw new ForbiddenException('Access Denied');
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.getTokens(
      user.id,
      user.email,
      user.roles,
    );

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      newRefreshToken,
    };
  }
}

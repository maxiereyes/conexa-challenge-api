/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../config/configuration';
import typeorm from '../config/typeorm';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { User } from '../entitites';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserRolesEnum } from '../user/enum/user-roles.enum';
import { LoginUserDto } from './dto/login-user.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration, typeorm],
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) =>
            configService.get('typeorm'),
        }),
        UserModule,
        AuthModule,
      ],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return accessToken and refreshToken on register user', async () => {
    const payload: RegisterUserDto = {
      email: 'test1@example.com',
      password: '123456',
      name: 'test',
      roles: [UserRolesEnum.USER],
    };

    const tokens = await authService.register(payload);
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
  });

  it('should return accessToken and refreshToken on login user', async () => {
    const payload: LoginUserDto = {
      email: 'test1@example.com',
      password: '123456',
    };
    const tokens = await authService.login(payload);
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
  });

  it('should return an error if user not found on login user', async () => {
    const payload: LoginUserDto = {
      email: 'test999@example.com',
      password: '123456',
    };

    expect(authService.login(payload)).rejects.toThrow(UnauthorizedException);
  });

  it('should return an error if user already exists on register user', async () => {
    const payload: RegisterUserDto = {
      email: 'test1@example.com',
      password: '123456',
      name: 'test',
      roles: [UserRolesEnum.USER],
    };
    expect(authService.register(payload)).rejects.toThrow(BadRequestException);
  });

  it('should return an error if password is incorrect on login user', async () => {
    const payload: LoginUserDto = {
      email: 'test1@example.com',
      password: '1234567',
    };

    expect(authService.login(payload)).rejects.toThrow(UnauthorizedException);
  });

  it('should return accessToken and refreshToken on rotate refreshToken', async () => {
    const payload: LoginUserDto = {
      email: 'test1@example.com',
      password: '123456',
    };

    const tokens = await authService.login(payload);
    const user = await userService.findByEmail(payload.email);

    const newTokens = await authService.refreshToken(
      user.id,
      tokens.refreshToken,
    );
    expect(newTokens.accessToken).toBeDefined();
    expect(newTokens.newRefreshToken).toBeDefined();
  });

  it('should return refreshToken null on logout', async () => {
    const userEmail = 'test1@example.com';

    const user = await userService.findByEmail(userEmail);
    const userUpdated = await authService.logout(user.id);

    expect(userUpdated.refreshToken).toBeNull();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await userService.deleteByEmail('test1@example.com');
  });
});

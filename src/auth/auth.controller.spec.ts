import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LoggerService } from '../common/custom-logger/logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import typeorm, { connectionSource } from '../config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRolesEnum } from '../user/enum/user-roles.enum';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let userService: UserService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
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
        JwtModule.register({}),
      ],
      controllers: [AuthController],
      providers: [LoggerService, AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should register a new user and return accessToken and refreshToken', async () => {
    const payload: RegisterUserDto = {
      email: 'test1@example.com',
      password: '123456',
      name: 'test',
      roles: [UserRolesEnum.USER],
    };

    const result = await authController.signup(payload);

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

  it('should login a user and return accessToken and refreshToken', async () => {
    const payload: LoginUserDto = {
      email: 'test1@example.com',
      password: '123456',
    };

    const result = await authController.signin(payload);

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

  it('should throw an error if user already exists on register', async () => {
    const payload: RegisterUserDto = {
      email: 'test1@example.com',
      password: '123456',
      name: 'test',
      roles: [UserRolesEnum.USER],
    };

    expect(authController.signup(payload)).rejects.toThrow(BadRequestException);
  });

  it('should throw an error if user not found on login', async () => {
    const payload: LoginUserDto = {
      email: 'test999@example.com',
      password: '123456',
    };

    expect(authController.signin(payload)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await userService.clearAllUsers();
    await connectionSource.destroy();
    await module.close();
  });
});

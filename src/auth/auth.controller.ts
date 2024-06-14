import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoggerService } from 'src/common/custom-logger/logger.service';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post('login')
  signin(@Body() payload: any) {
    this.loggerService.log('AuthController', 'Execute login user');
    return this.authService.login(payload);
  }

  @Post('register')
  signup(@Body() payload: any) {
    this.loggerService.log('AuthController', 'Execute register user');
    return this.authService.register(payload);
  }

  @Get('refresh-token')
  refreshToken() {
    this.loggerService.log('AuthController', 'Execute refresh token');
    return this.authService.refreshToken();
  }

  @Get('logout')
  logout() {
    this.loggerService.log('AuthController', 'Execute logout');
    return this.authService.logout();
  }
}

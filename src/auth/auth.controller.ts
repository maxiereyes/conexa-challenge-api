import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../common/custom-logger/logger.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiResponseSuccessCustom } from '../common/decorator/response-success-custom.decorator';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ExceptionFilterDto } from '../common/exception-filters/exception-filter';
import { Request } from 'express';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post('login')
  @ApiResponseSuccessCustom(AuthResponseDto)
  @ApiBadRequestResponse({ type: ExceptionFilterDto })
  signin(@Body() payload: LoginUserDto) {
    this.loggerService.log('AuthController', 'Execute login user');
    return this.authService.login(payload);
  }

  @Post('register')
  @ApiResponseSuccessCustom(AuthResponseDto)
  @ApiBadRequestResponse({ type: ExceptionFilterDto })
  signup(@Body() payload: RegisterUserDto) {
    this.loggerService.log('AuthController', 'Execute register user');
    return this.authService.register(payload);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  refreshToken(@Req() req: Request) {
    this.loggerService.log('AuthController', 'Execute refresh token');
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req: Request) {
    this.loggerService.log('AuthController', 'Execute logout');
    const userId = req.user['sub'];
    return await this.authService.logout(userId);
  }
}

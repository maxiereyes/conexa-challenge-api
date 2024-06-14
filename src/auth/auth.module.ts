import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { LoggerService } from 'src/common/custom-logger/logger.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, LoggerService],
})
export class AuthModule {}

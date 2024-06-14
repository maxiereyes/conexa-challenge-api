import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  register(payload: any) {
    return 'register';
  }

  login(payload: any) {
    return 'login';
  }

  logout() {
    return 'logout';
  }

  refreshToken() {
    return 'refresh token';
  }
}

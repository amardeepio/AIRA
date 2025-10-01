import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

class LoginDto {
  message: string;
  signature: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('nonce')
  getNonce(): { nonce: string } {
    return { nonce: this.authService.generateNonce() };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.validateAndLogin(
      loginDto.message,
      loginDto.signature,
    );
  }
}

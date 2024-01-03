// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyToken } from './../tasks/interfaces/jwt.interfaces';

@Controller('auth') 
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }): Promise<{ access_token: string }> {
    const access_token = await this.authService.login(body.username, body.password);
    return { access_token };
  }

  @Post( 'verify' )
  async verify ( @Body() body: { token: string; } ): Promise<VerifyToken> {
    return await this.authService.verifyToken( body.token );
  }
}

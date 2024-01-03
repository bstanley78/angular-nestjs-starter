// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { VerifyToken } from './../tasks/interfaces/jwt.interfaces';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login ( username: string, password: string ): Promise<string> {

    if ( username === process.env.USERNAME && password === process.env.PASSWORD ) {
      const payload = { username };
      return this.jwtService.sign( payload );
    } else { 
      return new Promise<string>( ( resolve, reject ) => {
        resolve( null );
      } );
    }
    
  }

  async verifyToken ( token: string ): Promise<VerifyToken> { 
    return this.jwtService.verify( token );
  }
}

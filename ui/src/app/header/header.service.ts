import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetTokenPayload, Token, VerifyToken } from '../interfaces/jwt.interfaces';

@Injectable( {
  providedIn: 'root'
} )
export class HeaderService {

  // Adjust the URL based on your NestJS API endpoint
  private apiUrl = '/api/auth';

  constructor ( private http: HttpClient ) { }

  // Method to get a token by sending a POST request to the login endpoint
  getToken ( payload: GetTokenPayload ): Observable<Token> {
    return this.http.post<Token>( `${ this.apiUrl }/login`, payload );
  }

  // Method to verify a token by sending a POST request to the verify endpoint
  verifyToken ( payload: string ): Observable<VerifyToken> {
    return this.http.post<VerifyToken>( `${ this.apiUrl }/verify`, { token: payload } );
  }
}

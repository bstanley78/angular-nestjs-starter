import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Token } from './interfaces/jwt.interfaces';

@Injectable( {
  providedIn: 'root'
} )
export class AppService {

  // BehaviorSubject to manage and share the token state
  private tokenSubject: BehaviorSubject<Token | null> = new BehaviorSubject( null );

  // Observable to expose the token state to components
  public token$ = this.tokenSubject.asObservable();

  constructor () { }

  // Method to set the token in the service
  setToken ( payload: Token ): void {
    this.tokenSubject.next( payload );
  }

  // Method to retrieve the current token from the service
  getToken (): Token | null {
    return this.tokenSubject.value;
  }

}

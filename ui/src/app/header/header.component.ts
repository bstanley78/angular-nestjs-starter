import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from './header.service';
import { BehaviorSubject } from 'rxjs';
import { Token } from '../interfaces/jwt.interfaces';
import { AppService } from '../app.service';

@Component( {
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
} )
export class HeaderComponent implements OnInit {
  // Form group for login
  loginForm: FormGroup;

  // ViewChild to reference the loginModal element
  @ViewChild( 'loginModal' ) loginModal: ElementRef;

  // BehaviorSubject for login alerts
  loginAlert: BehaviorSubject<{ type: string, message: string; }> = new BehaviorSubject( {
    type: null,
    message: null
  } );

  // BehaviorSubject to track login status
  isLoggedIn: BehaviorSubject<Boolean> = new BehaviorSubject( false );

  // BehaviorSubject to store the username
  user: BehaviorSubject<string> = new BehaviorSubject( null );

  constructor (
    private fb: FormBuilder,
    private headerService: HeaderService,
    private renderer: Renderer2,
    private appService: AppService
  ) {
    // Initialize FormGroups with default values and validators
    this.loginForm = this.fb.group( {
      username: [ '', Validators.required ],
      password: [ '', Validators.required ],
    } );
  }

  ngOnInit (): void { 
    // Set default values for testing
    this.loginForm.setValue( {
      username: 'admin',
      password: 'admin'
    } );
  }

  // Method to get the username from the backend by verifying the token
  getUserName () {
    this.headerService.verifyToken( this.appService.getToken().access_token ).subscribe( {
      next: ( success: any ) => {
        if ( success?.username ) {
          this.user.next( success?.username );
        }
      },
      error: ( err ) => {
        console.warn( err );
      }
    } );
  }

  // Method to handle user sign-in
  signIn () {
    this.headerService.getToken( this.loginForm.value ).subscribe( {
      next: ( response: any ) => {
        this.appService.setToken( response );
        if ( response?.access_token ) {
          this.isLoggedIn.next( true );
          this.closeModal();
        }
      },
      error: ( error ) => {
        console.warn( error );
        this.isLoggedIn.next( false );
      },
      complete: () => {
        this.getUserName();
      }
    } );
  }

  // Method to handle user sign-out
  signOut () {
    this.appService.setToken( { access_token: null } );

    this.appService.token$.subscribe( {
      next: ( response: Token ) => {
        if ( !response?.access_token ) {
          this.isLoggedIn.next( false );
        }
      },
      error: ( err ) => {
        console.warn( err );
      },
    } );
  }

  // Method to close the login modal
  closeModal (): void {
    const modalBackdrop = document.querySelector( '.modal-backdrop' );

    this.renderer.removeClass( this.loginModal.nativeElement, 'show' );
    this.renderer.setStyle( this.loginModal.nativeElement, 'display', 'none' );
    this.renderer.removeClass( document.body, 'modal-open' );
    this.renderer.removeAttribute( document.body, 'style' );

    if ( modalBackdrop ) {
      this.renderer.removeChild( document.body, modalBackdrop );
    }
  }
}

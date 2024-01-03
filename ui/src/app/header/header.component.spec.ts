import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Renderer2 } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { HeaderComponent } from './header.component';
import { HeaderService } from './header.service';
import { AppService } from '../app.service';
import { Token } from '../interfaces/jwt.interfaces';

describe( 'HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  // Mock data
  const mockToken: Token = { access_token: 'mock_token' };

  // Mock services
  const headerServiceMock = jasmine.createSpyObj( 'HeaderService', [ 'getToken', 'verifyToken' ] );
  const appServiceMock = { setToken: jasmine.createSpy(), token$: new BehaviorSubject<Token>( null ) };

  beforeEach(
    waitForAsync( () => {
      TestBed.configureTestingModule( {
        declarations: [ HeaderComponent ],
        imports: [ ReactiveFormsModule ],
        providers: [
          { provide: HeaderService, useValue: headerServiceMock },
          { provide: AppService, useValue: appServiceMock },
          FormBuilder,
          Renderer2,
        ],
      } ).compileComponents();
    } )
  );

  beforeEach( () => {
    fixture = TestBed.createComponent( HeaderComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  } );

  it( 'should create', () => {
    expect( component ).toBeTruthy();
  } );

  it( 'should handle user sign-in', () => {
    // Arrange
    headerServiceMock.getToken.and.returnValue( of( mockToken ) );

    // Act
    component.signIn();

    // Assert
    expect( appServiceMock.setToken ).toHaveBeenCalledWith( mockToken );
    expect( component.isLoggedIn.value ).toBe( true );
    expect( component.loginForm.value ).toEqual( { username: '', password: '' } );
    expect( component.closeModal ).toHaveBeenCalled();
  } );

  it( 'should handle user sign-out', () => {
    // Arrange
    appServiceMock.token$.next( mockToken );

    // Act
    component.signOut();

    // Assert
    expect( appServiceMock.setToken ).toHaveBeenCalledWith( { access_token: null } );
    expect( component.isLoggedIn.value ).toBe( false );
  } );

  it( 'should get username on component initialization', () => {
    // Arrange
    headerServiceMock.verifyToken.and.returnValue( of( { username: 'mock_user' } ) );

    // Act
    component.ngOnInit();

    // Assert
    expect( component.user.value ).toBe( 'mock_user' );
  } );

  // Add more tests as needed
} );


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
} );

// ... (Previous imports)

describe( 'HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  // Mock data
  const mockToken: Token = { access_token: 'mock_token' };

  // Mock services
  const headerServiceMock = jasmine.createSpyObj( 'HeaderService', [ 'getToken', 'verifyToken' ] );
  const appServiceMock = { setToken: jasmine.createSpy(), token$: new BehaviorSubject<Token>( null ) };

  beforeEach(
    waitForAsync( () => {
      TestBed.configureTestingModule( {
        declarations: [ HeaderComponent ],
        imports: [ ReactiveFormsModule ],
        providers: [
          { provide: HeaderService, useValue: headerServiceMock },
          { provide: AppService, useValue: appServiceMock },
          FormBuilder,
          Renderer2,
        ],
      } ).compileComponents();
    } )
  );

  beforeEach( () => {
    fixture = TestBed.createComponent( HeaderComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  } );

  it( 'should create', () => {
    expect( component ).toBeTruthy();
  } );

  it( 'should handle user sign-in', () => {
    // Arrange
    headerServiceMock.getToken.and.returnValue( of( mockToken ) );

    // Act
    component.signIn();

    // Assert
    expect( appServiceMock.setToken ).toHaveBeenCalledWith( mockToken );
    expect( component.isLoggedIn.value ).toBe( true );
    expect( component.loginForm.value ).toEqual( { username: '', password: '' } );
    expect( component.closeModal ).toHaveBeenCalled();
  } );

  it( 'should handle user sign-out', () => {
    // Arrange
    appServiceMock.token$.next( mockToken );

    // Act
    component.signOut();

    // Assert
    expect( appServiceMock.setToken ).toHaveBeenCalledWith( { access_token: null } );
    expect( component.isLoggedIn.value ).toBe( false );
  } );

  it( 'should get username on component initialization', () => {
    // Arrange
    headerServiceMock.verifyToken.and.returnValue( of( { username: 'mock_user' } ) );

    // Act
    component.ngOnInit();

    // Assert
    expect( component.user.value ).toBe( 'mock_user' );
  } );

  it( 'should not get username on component initialization if no access token', () => {
    // Arrange
    headerServiceMock.verifyToken.and.returnValue( of( {} ) );

    // Act
    component.ngOnInit();

    // Assert
    expect( component.user.value ).toBe( null );
  } );

  it( 'should reset login form on sign-out', () => {
    // Arrange
    component.loginForm.setValue( { username: 'test_user', password: 'test_password' } );

    // Act
    component.signOut();

    // Assert
    expect( component.loginForm.value ).toEqual( { username: '', password: '' } );
  } );

  // Add more tests as needed
} );


import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { LibraryService } from './library.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Book } from '../interfaces/book.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Token } from '../interfaces/jwt.interfaces';

@Component( {
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: [ './library.component.scss' ]
} )
export class LibraryComponent {

  // BehaviorSubjects to manage and share state for various components
  allBooks: BehaviorSubject<Book[]> = new BehaviorSubject( [] );
  pagedBooks: BehaviorSubject<Book[]> = new BehaviorSubject( [] );
  selectedBook: BehaviorSubject<Book> = new BehaviorSubject( null );
  selectedAction: BehaviorSubject<String> = new BehaviorSubject( null );
  isLoggedIn: BehaviorSubject<Boolean> = new BehaviorSubject( false );

  // FormGroups for book and search input
  bookForm: FormGroup;
  searchBooksForm: FormGroup;

  // ViewChild to reference the bookModal element
  @ViewChild( 'bookModal' ) bookModal: ElementRef;

  // Sorting and pagination variables
  sortColumn: string = 'title'; // Default sorting column
  sortDirection: number = 1; // 1 for ascending, -1 for descending
  itemsPerPage = 10; // Adjust this based on your requirement
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];

  constructor (
    private libraryService: LibraryService,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private appService: AppService
  ) {
    // Initialize FormGroups with default values and validators
    this.bookForm = this.fb.group( {
      _id: null,
      title: [ '', Validators.required ],
      description: [ '', Validators.required ],
      __v: null
    } );
    this.searchBooksForm = this.fb.group( {
      searchTerm: [ '', Validators.required ],
    } );
  }

  // Lifecycle hook to fetch all books and subscribe to token changes
  ngOnInit (): void {
    this.getAllBooks();
    this.appService
      .token$
      .subscribe( {
        next: ( response: Token ) => {
          this.isLoggedIn.next( ( response?.access_token ) ? true : false );
        }
      } );
  }

  // Method to fetch all books from the service
  getAllBooks (): void {
    this.libraryService.getAllBooks().subscribe( {
      next: ( books ) => {
        this.allBooks.next( books );
        this.pagedBooks.next( books.slice( 0, this.itemsPerPage ) );
        this.calculatePagination();
      },
      error: ( error ) => {
        console.error( 'Error fetching books:', error );
      }
    } );
  }

  // Method to handle user actions on a book item
  handleAction ( action: string, item: Book ) {
    this.selectedAction.next( action );
    this.selectedBook.next( item );

    if ( action !== 'add' ) {
      this.bookForm.setValue( item );
    } else {
      this.bookForm.reset();
    }
  }

  // Method to edit a book
  editBook () {
    const { _id } = this.bookForm.value;
    this.libraryService
      .updateTask( _id, this.bookForm.value )
      .subscribe( {
        next: () => {
          this.bookForm.reset();
          this.getAllBooks();
          this.closeModal();
        },
        error: ( error ) => {
          console.warn( error );
        }
      } );
  }

  // Method to add a new book
  addBook () {
    const { title, description } = this.bookForm.value;

    const payload = {
      title: ( title ),
      description: ( description )
    };

    if ( this.bookForm.valid ) {
      this.libraryService
        .createTask( payload )
        .subscribe( {
          next: () => {
            this.bookForm.reset();
            this.getAllBooks();
            this.closeModal();
          },
          error: ( error ) => {
            console.warn( error );
          }
        } );
    } else {
      this.bookForm.markAllAsTouched();
    }
  }

  // Method to delete a book
  deleteBook ( item: Book ) {
    const { _id } = item;
    this.libraryService
      .deleteTask( _id ).subscribe( {
        next: () => {
          this.bookForm.reset();
          this.getAllBooks();
        },
        error: ( error ) => {
          console.warn( error );
        }
      } );
  }

  // Method to close the modal
  closeModal (): void {
    const modalBackdrop = document.querySelector( '.modal-backdrop' );

    this.renderer.removeClass( this.bookModal.nativeElement, 'show' );
    this.renderer.setStyle( this.bookModal.nativeElement, 'display', 'none' );
    this.renderer.removeClass( document.body, 'modal-open' );
    this.renderer.removeAttribute( document.body, 'style' );

    if ( modalBackdrop ) {
      this.renderer.removeChild( document.body, modalBackdrop );
    }
  }

  // Method to handle sorting column change
  handleSortChange ( column: string ): void {
    if ( this.sortColumn === column ) {
      this.sortDirection = -this.sortDirection;
    } else {
      this.sortColumn = column;
      this.sortDirection = 1;
    }

    this.sortTable();
  }

  // Method to sort the table based on the selected column
  sortTable (): void {
    this.pagedBooks.next( this.pagedBooks.value.slice().sort( ( a, b ) => {
      const valueA = a[ this.sortColumn ].toLowerCase();
      const valueB = b[ this.sortColumn ].toLowerCase();

      if ( valueA < valueB ) {
        return -this.sortDirection;
      } else if ( valueA > valueB ) {
        return this.sortDirection;
      } else {
        return 0;
      }
    } ) );
  }

  // Method to calculate pagination
  calculatePagination ( arr?: Book[] ): void {
    const totalItems = ( ( arr || this.allBooks.value ) || [] ).length;
    this.totalPages = Math.ceil( totalItems / this.itemsPerPage );
    this.pages = Array.from( { length: this.totalPages }, ( _, i ) => i + 1 );

    const startIndex = ( this.currentPage - 1 ) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.pagedBooks.next( this.allBooks.value.slice( startIndex, endIndex ) );
  }

  // Method to navigate to a specific page
  goToPage ( page: number ): void {
    if ( page >= 1 && page <= this.totalPages ) {
      this.currentPage = page;
      this.calculatePagination();
    }
  }

  // Method to search for books based on the entered search term
  searchBooks (): void {
    const { searchTerm } = this.searchBooksForm.value;

    if ( searchTerm.length ) {
      let filteredBooks: Book[] = [];

      if ( this.allBooks.value && this.pagedBooks.value ) {
        filteredBooks = this.allBooks.value.filter( book =>
          book.title ? book.title.toLowerCase().includes( searchTerm.toLowerCase() ) ||
            book.description.toLowerCase().includes( searchTerm.toLowerCase() ) : null
        );

        if ( filteredBooks.length ) {
          this.allBooks.next( filteredBooks.slice( 0, this.itemsPerPage ) );
        } else {
          this.allBooks.next( [ {
            title: null,
            description: null
          } ] );
        }

        this.pagedBooks.next( filteredBooks.slice( 0, this.itemsPerPage ) );
        this.calculatePagination( this.pagedBooks.value );
      }
    } else {
      this.resetTable();
    }
  }

  // Method to reset the table to display all books
  resetTable () {
    this.getAllBooks();
    this.searchBooksForm.reset();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../interfaces/book.interface';

@Injectable( {
  providedIn: 'root'
} )
export class LibraryService {

  // Adjust the URL based on your NestJS API endpoint
  private apiUrl = '/api/tasks';

  constructor ( private http: HttpClient ) { }

  // Method to fetch all books
  getAllBooks (): Observable<Book[]> {
    return this.http.get<Book[]>( this.apiUrl );
  }

  // Method to fetch a book by ID
  getTaskById ( id: string ): Observable<Book | undefined> {
    return this.http.get<Book>( `${ this.apiUrl }/${ id }` );
  }

  // Method to create a new book
  createTask ( task: Book ): Observable<Book> {
    return this.http.post<Book>( this.apiUrl, task );
  }

  // Method to update a book
  updateTask ( id: string, task: Book ): Observable<Book | undefined> {
    return this.http.put<Book>( `${ this.apiUrl }/${ id }`, task );
  }

  // Method to delete a book
  deleteTask ( id: string ): Observable<void> {
    return this.http.delete<void>( `${ this.apiUrl }/${ id }` );
  }
}

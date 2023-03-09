import { BehaviorSubject, Observable } from 'rxjs';
import { Sheet } from './../wiki/classes/sheet';
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable object-shorthand */
import { Book } from './../wiki/classes/book';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  currentSheet: Sheet;

  books: BehaviorSubject<Book[]>=new BehaviorSubject<Book[]>([]);
  books$ = this.books as Observable<Book[]>;

  constructor() { }

  /*
addNewBook(title: string){
  const currentValue = this.books.getValue();
  const newBook = new Book(this.generateId(), this.books.getValue().length.toString(), title);
  this.books.next(currentValue.concat(newBook));
}

updateBook(id: string, orderId: string, title: string){

  const currentBooks = this.books.getValue();

  let bookIndex = currentBooks.findIndex(book=>book.id === id);
  currentBooks[bookIndex].orderId = orderId;
  currentBooks[bookIndex].title = title;

  this.books.next(currentBooks);
}

deleteBook(orderId: string){

  const currentBooks = this.books.getValue();
  let bookIndex = currentBooks.findIndex(book=>book.orderId === orderId);
  currentBooks.splice(bookIndex, 1);
  this.books.next(currentBooks);
}
*/




}


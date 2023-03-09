import { IonModal } from '@ionic/angular';
import { DataService } from './../data/data.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { StateService } from './../state/state.service';

/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Router } from '@angular/router';
import { WikiService } from './wiki.service';
import { Book } from './classes/book';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/core';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.page.html',
  styleUrls: ['./wiki.page.scss'],
})
export class WikiPage implements OnInit {

  setEdit: boolean = false;
  changes: boolean = false;

  books: BehaviorSubject<Book[]>= new BehaviorSubject<Book[]>([]);
  books$ = this.books as Observable<Book[]>;

  constructor(private wikiService: WikiService, private router: Router, private state: StateService, private data: DataService) { }

  async ngOnInit() {
    this.data.getAllBooks().then(books=>{
        this.books.next(books);
    });

  }

  openBook(book: Book) {
    this.wikiService.selectedBook = book;
    this.router.navigate(['wiki/book']);
  }

  deleteBook(book: Book, i: number){
    this.changes=true;
    const currentBooks = this.books.getValue();
    currentBooks.splice(i,1);
    this.books.next(currentBooks);
    this.data.deleteBook(book.id);
  }

  async newBook(){
    this.changes = true;
    const newBook: Book = new Book('dummy',this.books.getValue().length.toString(),'neues Modul');
    console.log(newBook);
    const id = (await this.wikiService.addNewBook(newBook)).id;
    newBook.id = id;

    const currentBooks = this.books.getValue();
    console.log(currentBooks);

    const newBooks = currentBooks.concat(newBook);
    console.log(newBooks);


    this.books.next(newBooks);
  }

  toggleEdit(){
    console.log(this.setEdit);
    console.log(this.changes);

    if(this.setEdit){
      this.setEdit = false;
      if(this.changes){
        console.log('make updates');
        this.books.getValue().forEach(book=>{
          this.wikiService.updateBook(book);
        });
        this.changes =false;
      }
      else{
        console.log('no changes');
      }

    }
    else{
      this.setEdit = true;
      this.changes = false;
    }
  }

  setChanges(value: boolean){
    this.changes = value;
    console.log('setChanges'+value);
  }


  async reorderItems(ev: CustomEvent<ItemReorderEventDetail>){

    this.setChanges(true);

    const currentBooks = await this.books.getValue();
    const newBooks = ev.detail.complete(currentBooks);

    newBooks.forEach((book,i)=>{
      book.orderId = i as string;
    });

    this.books.next(newBooks);

}


}

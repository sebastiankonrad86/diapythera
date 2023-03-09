import { ItemReorderEventDetail } from '@ionic/core';
import { DataService } from './../../data/data.service';
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chapter } from './../classes/chapter';
import { WikiService } from './../wiki.service';
import { Book } from './../classes/book';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {

  selectedBook: Book;

  setEdit: boolean = false;
  changes: boolean = false;

  chapters: BehaviorSubject<Chapter[]>= new BehaviorSubject<Chapter[]>([]);
  chapters$ = this.chapters as Observable<Chapter[]>;

  constructor(private wikiService: WikiService, private router: Router, private data: DataService) { }

  ngOnInit() {
    this.selectedBook = this.wikiService.selectedBook;
    this.data.getAllChapters().then(chapters=>{
      const result = chapters.filter((chapter)=>chapter.bookId === this.selectedBook.id);
      this.chapters.next(result);
  });
  }

  openChapter(chapter: Chapter) {
    this.wikiService.selectedChapter = chapter;
    this.router.navigate(['wiki/chapter']);
  }

  deleteChapter(chapter: Chapter, i: number){
    this.changes=true;
    const currentChapters = this.chapters.getValue();
    currentChapters.splice(i,1);
    this.chapters.next(currentChapters);
    this.data.deleteBook(chapter.id);
  }

  async newChapter(){
    this.changes = true;
    const newChapter: Chapter = new Chapter('dummy',this.selectedBook.id, this.chapters.getValue().length.toString(),'neues Kapitel');
    const id = (await this.wikiService.addNewChapter(newChapter)).id;
    newChapter.id = id;

    const currentBooks = this.chapters.getValue();

    const newChapters = currentBooks.concat(newChapter);


    this.chapters.next(newChapters);
  }

  toggleEdit(){

    if(this.setEdit){
      this.setEdit = false;
      if(this.changes){
        console.log('make updates');
        this.chapters.getValue().forEach(chapter=>{
          this.wikiService.updateChapter(chapter);
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

    const currentChapters = await this.chapters.getValue();
    const newChapters = ev.detail.complete(currentChapters);

    newChapters.forEach((chapter,i)=>{
      chapter.orderId = i as string;
    });

    this.chapters.next(newChapters);

}

}

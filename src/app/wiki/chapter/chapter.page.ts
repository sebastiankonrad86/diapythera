import { ItemReorderEventDetail } from '@ionic/core';
import { WikiService } from './../wiki.service';
import { DataService } from './../../data/data.service';
import { Router } from '@angular/router';
import { Sheet } from './../classes/sheet';
import { BehaviorSubject, Observable } from 'rxjs';
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Chapter } from './../classes/chapter';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.page.html',
  styleUrls: ['./chapter.page.scss'],
})
export class ChapterPage implements OnInit {

  selectedChapter: Chapter;

  setEdit: boolean = false;
  changes: boolean = false;

  sheets: BehaviorSubject<Sheet[]>= new BehaviorSubject<Sheet[]>([]);
  sheets$ = this.sheets as Observable<Sheet[]>;

  constructor(private wikiService: WikiService, private router: Router, private data: DataService) { }

  ngOnInit() {
    this.selectedChapter = this.wikiService.selectedChapter;
    this.data.getAllSheets().then(sheets=>{
      console.log(sheets);
      const result = sheets.filter((sheet)=>sheet.chapterId === this.selectedChapter.id);
      console.log(result);
      this.sheets.next(result);
  });
  }

  openSheet(sheet: Sheet) {
    this.wikiService.selectedSheet = sheet;
    this.router.navigate(['wiki/sheet-creater']);
  }

  deleteSheet(sheet: Sheet, i: number){
    this.changes=true;
    const currentSheets = this.sheets.getValue();
    currentSheets.splice(i,1);
    this.sheets.next(currentSheets);
    this.data.deleteBook(sheet.id);
  }

  async newSheet(){
    this.changes = true;
    const newSheet: Sheet = new Sheet('dummy',this.selectedChapter.id, this.sheets.getValue().length.toString(),'neues Arbeitsblatt');
    const id = (await this.wikiService.addNewSheet(newSheet)).id;
    newSheet.id = id;

    const currentSheets = this.sheets.getValue();

    const newSheets = currentSheets.concat(newSheet);

    this.sheets.next(newSheets);
  }

  toggleEdit(){

    if(this.setEdit){
      this.setEdit = false;
      if(this.changes){
        console.log('make updates');
        this.sheets.getValue().forEach(sheet=>{
          this.wikiService.updateSheet(sheet);
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

    const currentSheets = await this.sheets.getValue();
    const newSheets = ev.detail.complete(currentSheets);

    newSheets.forEach((sheet,i)=>{
      sheet.orderId = i as string;
    });

    this.sheets.next(newSheets);

}

}

import { WikiService } from './../../wiki.service';
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Subject } from 'rxjs';
import { DataService } from './../../../data/data.service';
import { TaskComponent } from './../task/task.component';
import { Component, Input, OnInit, Output } from '@angular/core';
import { Article } from '../../classes/article';
import { Task } from '../task/task';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit, TaskComponent {
  @Input() task: Task;
  @Input() preview: boolean = false;
  changes: boolean = false;
max: any;

  constructor( private wikiService: WikiService) {}

  ngOnInit(): void {
    console.log(this.task);
  }

  save(){
    this.wikiService.updateArticle(this.task);
    this.changes = false;
  }

  setChanges(){
    this.changes = true;
  }

  deleteArticle() {
    this.wikiService.deleteArticle(this.task.id);
  }

  addHelpertext() {
    this.changes = true;
    this.task.data.helpertext = '';
    this.task.data.showHelpertext = true;
  }

  removeHelpertext() {
    this.changes = true;
    this.task.data.helpertext = '';
    this.task.data.showHelpertext = false;
  }

  updateArticle() {
    this.wikiService.updateArticle(
      new Article(
        this.task.component,
        this.task.id,
        this.task.sheetId,
        this.task.orderId,
        this.task.data
      )
    );
  }



  quillConfiguration = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
    ],
  };
}

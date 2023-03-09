/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Subject } from 'rxjs';
import { DataService } from './../../../data/data.service';
import { TaskComponent } from './../task/task.component';
import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../classes/article';
import { Task } from '../task/task';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit, TaskComponent {
  @Input() task: Task;
  @Input() save: Subject<boolean>;
  @Input() preview: boolean = false;
  helpertextAdded: boolean;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.save.subscribe((save) => {
      if (save === true) {
        this.updateArticle();
      }
    });

    this.helpertextAdded = this.task.data.helpertext !== '';
  }

  deleteArticle() {
    this.dataService.deleteArticle(this.task.id);
  }

  addHelpertext() {
    this.task.data.helpertext = 'Helfertext hier eingeben';
    this.helpertextAdded = true;
  }

  removeHelpertext() {
    this.task.data.helpertext = '';
    this.helpertextAdded = false;
  }

  updateArticle() {
    this.dataService.updateArticle(
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

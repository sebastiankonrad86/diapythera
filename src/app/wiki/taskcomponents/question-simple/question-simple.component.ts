import { WikiService } from './../../wiki.service';
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { LoadingController } from '@ionic/angular';
import { QuestionSimple } from './../../classes/questionSimple';
import { DataService } from './../../../data/data.service';
import { TaskComponent } from './../task/task.component';
import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../task/task';

@Component({
  selector: 'app-question-simple',
  templateUrl: './question-simple.component.html',
  styleUrls: ['./question-simple.component.scss'],
})
export class QuestionSimpleComponent implements OnInit, TaskComponent {
  @Input() task: Task;
  @Input() preview: boolean = false;
  changes: boolean = false;

  constructor(private wikiService: WikiService) {}

  ngOnInit(): void {
  }

  deleteQuestionSimple() {
    this.wikiService.deleteQuestionSimple(this.task.id);
  }

  updateQuestionSimple() {
    this.wikiService.updateQuestionSimple(
      new QuestionSimple(
        this.task.component,
        this.task.id,
        this.task.sheetId,
        this.task.orderId,
        this.task.data
      )
    );
  }

  save(){
    this.wikiService.updateQuestionSimple(this.task);
    this.changes = false;
  }

  setChanges(){
    this.changes = true;
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
}

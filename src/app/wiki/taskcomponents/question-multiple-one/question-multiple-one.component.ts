/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { WikiService } from './../../wiki.service';
import { IonModal } from '@ionic/angular';
import { TaskComponent } from './../task/task.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Task } from '../task/task';
import { QuestionMultipleOne } from '../../classes/questionMultipleOne';

@Component({
  selector: 'app-question-multiple-one',
  templateUrl: './question-multiple-one.component.html',
  styleUrls: ['./question-multiple-one.component.scss'],
})
export class QuestionMultipleOneComponent implements OnInit, TaskComponent {
  @Input() task: Task;
  @Input() preview: boolean = false;
  @ViewChild(IonModal) modal: IonModal;
  changes: boolean = false;

  newChoice: string = '';

  constructor(private wikiService: WikiService) {}

  ngOnInit(): void {
  }

  updateQuestionMultipleOne() {
    this.wikiService.updateQuestionMultipleOne(
      new QuestionMultipleOne(
        this.task.component,
        this.task.id,
        this.task.sheetId,
        this.task.orderId,
        this.task.data
      )
    );
  }

  save(){
    this.wikiService.updateQuestionMultipleOne(this.task);
    this.changes = false;
  }

  setChanges(){
    this.changes = true;
  }

  deleteQuestionMultipleOne() {
    this.wikiService.deleteQuestionMultipleOne(this.task.id);
  }

  addChoice(choice: string) {
    this.changes = true;
    this.task.data.choices.push(choice);
  }

  deleteChoice(i: number) {
    this.changes = true;
    this.task.data.choices = this.task.data.choices.filter((choice) => {
      return choice !== this.task.data.choices[i];
    });
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

  onWillDismiss($event) {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {}

  cancel() {}
}

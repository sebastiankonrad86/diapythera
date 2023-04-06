/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { WikiService } from './../../wiki.service';
import { IonModal } from '@ionic/angular';
import { TaskComponent } from './../task/task.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Task } from '../task/task';
import { QuestionMultiple } from '../../classes/questionMultiple';

@Component({
  selector: 'app-question-multiple',
  templateUrl: './question-multiple.component.html',
  styleUrls: ['./question-multiple.component.scss'],
})
export class QuestionMultipleComponent implements OnInit, TaskComponent {
  @Input() task: Task;
  @Input() preview: boolean = false;
  @ViewChild(IonModal) modal: IonModal;
  changes: boolean = false;

  newChoice: string = '';

  constructor(private wikiService: WikiService) {}

  ngOnInit(): void {
    this.wikiService.sheetSaved.subscribe(savedChanges=>{
      if(savedChanges){
        this.changes = false;
      }
    });
  }

  updateQuestionMultiple() {
    this.wikiService.updateQuestionMultiple(
      new QuestionMultiple(
        this.task.component,
        this.task.id,
        this.task.sheetId,
        this.task.orderId,
        this.task.data
      )
    );
  }

  save(){
    this.wikiService.updateQuestionMultiple(this.task);
    this.changes = false;
  }

  deleteTask(){
    this.wikiService.taskDeleteRequest.next(this.task);
  }

  setChanges(){
    this.changes = true;
  }

  deleteQuestionMultiple() {
    this.wikiService.deleteQuestionMultiple(this.task.id);
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

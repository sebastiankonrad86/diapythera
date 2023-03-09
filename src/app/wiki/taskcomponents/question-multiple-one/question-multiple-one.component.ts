/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Subject } from 'rxjs';
import { DataService } from './../../../data/data.service';
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
  @Input() save: Subject<boolean>;
  @Input() preview: boolean = false;
  @ViewChild(IonModal) modal: IonModal;
  helpertextAdded: boolean;

  newChoice: string = '';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.save.subscribe((save) => {
      if (save === true) {
        this.updateQuestionMultipleOne();
      }
    });

    this.helpertextAdded = this.task.data.helpertext !== '';
  }

  updateQuestionMultipleOne() {
    this.dataService.updateQuestionMultipleOne(
      new QuestionMultipleOne(
        this.task.component,
        this.task.id,
        this.task.sheetId,
        this.task.orderId,
        this.task.data
      )
    );
  }

  deleteQuestionMultipleOne() {
    this.dataService.deleteQuestionMultipleOne(this.task.id);
  }

  addChoice(choice: string) {
    this.task.data.choices.push(choice);
  }

  deleteChoice(i: number) {
    this.task.data.choices = this.task.data.choices.filter((choice) => {
      return choice !== this.task.data.choices[i];
    });
  }

  addHelpertext() {
    this.task.data.helpertext = 'Helfertext hier eingeben';
    this.helpertextAdded = true;
  }

  removeHelpertext() {
    this.task.data.helpertext = '';
    this.helpertextAdded = false;
  }

  onWillDismiss($event) {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {}

  cancel() {}
}

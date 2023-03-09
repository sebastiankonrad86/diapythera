/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Subject } from 'rxjs';
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
  @Input() save: Subject<boolean>;
  @Input() preview: boolean = false;
  helpertextAdded: boolean;

  constructor(
    private dataService: DataService,
    private loading: LoadingController
  ) {}

  ngOnInit(): void {
    this.save.subscribe((save) => {
      if (save === true) {
        this.updateQuestionSimple();
      }
    });

    this.helpertextAdded = this.task.data.helpertext !== '';
  }

  deleteQuestionSimple() {
    this.dataService.deleteQuestionSimple(this.task.id);
  }

  updateQuestionSimple() {
    this.dataService.updateQuestionSimple(
      new QuestionSimple(
        this.task.component,
        this.task.id,
        this.task.sheetId,
        this.task.orderId,
        this.task.data
      )
    );
  }

  addHelpertext() {
    this.task.data.helpertext = 'Helfertext hier eingeben';
    this.helpertextAdded = true;
  }

  removeHelpertext() {
    this.task.data.helpertext = '';
    this.helpertextAdded = false;
  }
}

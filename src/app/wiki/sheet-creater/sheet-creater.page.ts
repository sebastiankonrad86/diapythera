/* eslint-disable max-len */
import { Article } from './../classes/article';
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { WikiService } from './../wiki.service';
import { WikiPage } from './../wiki.page';
import { StateService } from './../../state/state.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Sheet } from './../classes/sheet';
import { DataService } from './../../data/data.service';
import { Task } from '../taskcomponents/task/task';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-sheet-creater',
  templateUrl: './sheet-creater.page.html',
  styleUrls: ['./sheet-creater.page.scss'],
})
export class SheetCreaterPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  selectedSheet: Sheet;


  tasks: BehaviorSubject<Task[]>= new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasks as Observable<Task[]>;
  changes: boolean = false;

  save: Subject<boolean> = new Subject();

  constructor(
    private wikiService: WikiService,
    private data: DataService,
    private state: StateService,
    private loading: LoadingController
  ) {}

  ngOnInit() {
    this.selectedSheet = this.wikiService.selectedSheet;
    this.data.getAllTasks().then(tasks=>{
      const result = tasks.filter((task)=>task.sheetId === this.selectedSheet.id);
      this.tasks.next(result);
  });
  }

  async addText() {
    this.changes = true;
    const newArticle: Article = new Article(this.data.getComponentFromString('ArticleComponent'), 'dummyId', this.selectedSheet.id, this.tasks.getValue().length.toString(), 'Artikel');
    const id = (await this.wikiService.addNewArticle(newArticle)).id;
    newArticle.id = id;

    const currentTasks = this.tasks.getValue();

    const newTasks = currentTasks.concat(newArticle);

    this.tasks.next(newTasks);

  }

  addQuestionSimple() {
    this.data.addNewQuestionSimple(this.selectedSheet.id);
  }

  addQuestionMultiple() {
    this.data.addNewQuestionMultiple(this.selectedSheet.id);
  }

  addQuestionMultipleOne() {
    this.data.addNewQuestionMultipleOne(this.selectedSheet.id);
  }

  async saveChanges() {
    const loader = await this.loading.create();
    await loader.present();

    await this.save.next(true);
    await this.save.next(false);

    await loader.dismiss();
  }

  onWillDismiss($event) {}

  confirm() {
    this.modal.dismiss(null, 'cancel');
  }
}

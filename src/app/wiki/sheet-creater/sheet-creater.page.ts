import { AlertController } from '@ionic/angular';
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { QuestionMultipleOne } from './../classes/questionMultipleOne';
import { QuestionMultiple } from './../classes/questionMultiple';
import { QuestionSimple } from './../classes/questionSimple';
import { WikiService } from './../wiki.service';
import { Observable, BehaviorSubject, take } from 'rxjs';
import { Sheet } from './../classes/sheet';
import { Task } from '../taskcomponents/task/task';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, LoadingController } from '@ionic/angular';
import { Article } from './../classes/article';

@Component({
  selector: 'app-sheet-creater',
  templateUrl: './sheet-creater.page.html',
  styleUrls: ['./sheet-creater.page.scss'],
})
export class SheetCreaterPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  openButtons: number = -10;
  loading: HTMLIonLoadingElement;
  selectedSheet: Sheet;

  tasks: BehaviorSubject<Task[]>= new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasks as Observable<Task[]>;

  constructor(
    private wikiService: WikiService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    this.selectedSheet = this.wikiService.selectedSheet;
     await this.loadData();
     this.wikiService.taskDeleteRequest.subscribe(task=>{
      const i = this.tasks.getValue().findIndex(t=>{t.orderId =task.orderId;});
      this.deleteTask(task,i);
     });
  }

  async loadData(){
    this.wikiService.getAllTasks().then(tasks=>{
      const result = tasks.filter((task)=>task.sheetId === this.selectedSheet.id);
      this.tasks.next(result);
  });
  }

  setOpenButtons(i: number){
    if(this.openButtons === i){
      this.openButtons = -10;
    }
    else{
      this.openButtons = i;
    }
  }

  async saveAll(){
    await this.startLoading();
    await this.tasks.getValue().forEach(task=>{
      this.wikiService.updateTask(task);
    });
    await this.stopLoading().then(x=>this.presentAlert());
    this.wikiService.saveSheet();
  }

  async addText(i: number) {
    i++;
    const newArticle: Article = new Article(this.wikiService.getComponentFromString('ArticleComponent'), 'dummyId', this.selectedSheet.id, i.toString(), {text: 'Artikel', helpertext:'', showHelpertext: false});
    const id = (await this.wikiService.addNewArticle(newArticle)).id;
    newArticle.id = id;

    let newTasks = [];

    this.tasks.pipe(take(1)).subscribe(tasks=>{
      newTasks = tasks;
      newTasks.splice(i,0,newArticle);
      newTasks.forEach((task, index)=>{
        task.orderId = index;
      });
      newTasks.forEach(task=>{
        this.wikiService.updateTask(task);
      });
      this.tasks.next(newTasks);
    });

  }

  async addQuestionSimple(i: number) {
    i++;
    const newQuestionSimple: QuestionSimple = new QuestionSimple(this.wikiService.getComponentFromString('QuestionSimpleComponent'), 'dummyId', this.selectedSheet.id, i.toString(), {question: 'Einfache Frage', helpertext: '', showHelpertext: false});
    const id = (await this.wikiService.addNewQuestionSimple(newQuestionSimple)).id;
    newQuestionSimple.id = id;

    let newTasks = [];

    this.tasks.pipe(take(1)).subscribe(tasks=>{
      newTasks = tasks;
      newTasks.splice(i,0,newQuestionSimple);
      newTasks.forEach((task, index)=>{
        task.orderId = index;
      });
      newTasks.forEach(task=>{
        this.wikiService.updateTask(task);
      });
      this.tasks.next(newTasks);
    });
  }

  async addQuestionMultiple(i: number) {
    i++;
    const newQuestionMultiple: QuestionMultiple = new QuestionMultiple(this.wikiService.getComponentFromString('QuestionMultipleComponent'), 'dummyId', this.selectedSheet.id, i.toString(), {question: 'MC Frage (Mehrfachauswahl)', choices: ['Antwort 1'], helpertext: '', showHelpertext: false});
    const id = (await this.wikiService.addNewQuestionMultiple(newQuestionMultiple)).id;
    newQuestionMultiple.id = id;

    let newTasks = [];

    this.tasks.pipe(take(1)).subscribe(tasks=>{
      newTasks = tasks;
      newTasks.splice(i,0,newQuestionMultiple);
      newTasks.forEach((task, index)=>{
        task.orderId = index;
      });
      newTasks.forEach(task=>{
        this.wikiService.updateTask(task);
      });
      this.tasks.next(newTasks);
    });
  }

  async addQuestionMultipleOne(i: number) {
    i++;
    const newQuestionMultipleOne: QuestionMultipleOne = new QuestionMultipleOne(this.wikiService.getComponentFromString('QuestionMultipleOneComponent'), 'dummyId', this.selectedSheet.id, i.toString(), {question: 'MC Frage (Einfachfachauswahl)', choices: ['Antwort 1'], helpertext: '', showHelpertext: false});
    const id = (await this.wikiService.addNewQuestionMultipleOne(newQuestionMultipleOne)).id;
    newQuestionMultipleOne.id = id;

    let newTasks = [];

    this.tasks.pipe(take(1)).subscribe(tasks=>{
      newTasks = tasks;
      newTasks.splice(i,0,newQuestionMultipleOne);
      newTasks.forEach((task, index)=>{
        task.orderId = index;
      });
      newTasks.forEach(task=>{
        this.wikiService.updateTask(task);
      });
      this.tasks.next(newTasks);
    });
  }

  saveTask(task: Task){
    this.wikiService.updateTask(task);
  }

  async deleteTask(task: Task, i: number){
    this.tasks.pipe(take(1)).subscribe(tasks=>{
      this.tasks.next(tasks.splice(i,1));
    });
    await this.wikiService.deleteTask(task);
    this.loadData();

  }

  onWillDismiss($event) {}

  confirm() {
    this.modal.dismiss(null, 'cancel');
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'Änderungen hochgeladen!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async startLoading() {
    this.loading = await this.loadingController.create();
    await this.loading.present();
  }

  async stopLoading() {
    await this.loading.dismiss();
  }
}

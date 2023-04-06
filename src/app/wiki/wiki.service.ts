import { BehaviorSubject, Subject } from 'rxjs';
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable object-shorthand */
import { QuestionMultipleOneComponent } from './taskcomponents/question-multiple-one/question-multiple-one.component';
import { QuestionMultipleComponent } from './taskcomponents/question-multiple/question-multiple.component';
import { QuestionSimpleComponent } from './taskcomponents/question-simple/question-simple.component';
import { ArticleComponent } from './taskcomponents/article/article.component';
import { QuestionMultipleOne } from './classes/questionMultipleOne';
import { QuestionMultiple } from './classes/questionMultiple';
import { QuestionSimple } from './classes/questionSimple';
import { Sheet } from './classes/sheet';
import { DataService } from './../data/data.service';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Book } from './classes/book';
import { Chapter } from './classes/chapter';
import { docData, addDoc, updateDoc, Firestore } from '@angular/fire/firestore';
import {
  collection,
  doc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { Article } from './classes/article';
import { Task } from './taskcomponents/task/task';

@Injectable({
  providedIn: 'root',
})
export class WikiService {

  public selectedBook: Book;
  public selectedChapter: Chapter;
  public selectedSheet: Sheet;

  public sheetSaved: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public taskDeleteRequest: Subject<Task> = new Subject<Task>();

  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private loadingController: LoadingController,
  ) {}

  /* BOOK *************************************/

  async getAllBooks() {
    const ref = collection(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'books'
    );

    const b: Book[] = [];
    (await getDocs(ref)).forEach(doc=>{
      b.push(new Book(doc.id,doc.data().orderId, doc.data().title));
    });

    return this.sortByOrderId(b);
  }

  async addNewBook(book: Book) {
    const ref = collection(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'books'
    );

    /* erstelle das Doc, dann nimm die Id und speichere Sie mit updateDoc im Doc */
    return addDoc(ref, {
      title: book.title,
      orderId: book.orderId,
    });
  }

  async updateBook(book: Book) {
    const loading = await this.loadingController.create();
    await loading.present();

    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'books',
      book.id
    );

    await updateDoc(ref, {
      id: book.id,
      orderId: book.orderId,
      title: book.title,
    });

    await loading.dismiss();
  }

  async deleteBook(book: Book) {
    /* lösche zuerst Alle Kapitel und deren Artikel*/
    /* TODO */

    /* dann lösche das Buch*/
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'books',
      book.id
    );

    await deleteDoc(ref);
  }

  /* CHAPTER *************************************/

  async getAllChapters() {
    const ref = query(
      collection(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'chapters'
      )
    );

    const c: Chapter[] = [];
    (await getDocs(ref)).forEach(doc=>{
      c.push(new Chapter(doc.id,doc.data().bookId, doc.data().orderId, doc.data().title));
    });

    return this.sortByOrderId(c);
  }

  async addNewChapter(chapter: Chapter) {
    const ref = collection(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'chapters'
    );

    /* erstelle das Doc, dann nimm die Id und speichere Sie mit updateDoc im Doc */
    return addDoc(ref, {
      bookId: chapter.bookId,
      orderId: chapter.orderId,
      title: chapter.title,
    });

  }

  async getChapters(bookId: string) {
    const ref = query(
      collection(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'chapters'
      )
    );

    const result = [];

    const docs = await getDocs(ref);
    docs.forEach((document) => {
      if (document.data().bookId === bookId) {
        result.push(
          new Chapter(
            document.data().id,
            document.data().bookId,
            document.data().orderId,
            document.data().title
          )
        );
      }
    });

    return result;
  }

  async updateChapter(chapter: Chapter) {
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'chapters',
      chapter.id
    );

    await updateDoc(ref, {
      id: chapter.id,
      bookId: chapter.bookId,
      orderId: chapter.orderId,
      title: chapter.title,
    });
  }

  async deleteChapter(chapter: Chapter) {
    /* lösche alle Artikel des Kapitels*/

    /* TODO */

    /* nun lösche das Kapitel selbst*/
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'chapters',
      chapter.id
    );
    await deleteDoc(ref);
  }

  /* Sheets **************************************/

  async getAllSheets() {
    const ref = query(
      collection(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'sheets'
      )
    );

    const s: Sheet[] = [];
    (await getDocs(ref)).forEach(doc=>{
      s.push(new Sheet(doc.id,doc.data().chapterId, doc.data().orderId, doc.data().title));
    });

    return this.sortByOrderId(s);
  }

  async addNewSheet(sheet: Sheet) {
    const ref = collection(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'sheets'
    );

    /* erstelle das Doc, dann nimm die Id und speichere Sie mit updateDoc im Doc */
    return addDoc(ref, {
      chapterId: sheet.chapterId,
      orderId: sheet.orderId,
      title: sheet.title,
    });

  }

  updateSheet(sheet: Sheet) {
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'sheets',
      sheet.id
    );

    updateDoc(ref, {
      orderId: sheet.orderId,
      chapterId: sheet.chapterId,
      title: sheet.title,
    });
  }

  /* TASKS */

  async getAllTasks() {
    const ref = query(
      collection(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'tasks'
      )
    );

    const result: Task[] =[];
    (await getDocs(ref)).forEach(doc=>{
      if (doc.data().component === 'ArticleComponent') {
        const a = new Article(
          this.getComponentFromString(doc.data().component),
          doc.id,
          doc.data().sheetId,
          doc.data().orderId,
          { text: doc.data().text, helpertext: doc.data().helpertext, showHelpertext: doc.data().showHelpertext }
        );
        result.push(a);
      }

      if (doc.data().component === 'QuestionSimpleComponent') {
        const a = new QuestionSimple(
          this.getComponentFromString(doc.data().component),
          doc.id,
          doc.data().sheetId,
          doc.data().orderId,
          { question: doc.data().question,
            helpertext: doc.data().helpertext,
            showHelpertext: doc.data().showHelpertext
          }
        );
        result.push(a);
      }

      if (doc.data().component === 'QuestionMultipleComponent') {
        const a = new QuestionMultiple(
          this.getComponentFromString(doc.data().component),
          doc.id,
          doc.data().sheetId,
          doc.data().orderId,
          {
            question: doc.data().question,
            choices: doc.data().choices,
            helpertext: doc.data().helpertext,
            showHelpertext: doc.data().showHelpertext
          }
        );
        result.push(a);
      }

      if (doc.data().component === 'QuestionMultipleOneComponent') {
        const a = new QuestionMultipleOne(
          this.getComponentFromString(doc.data().component),
          doc.id,
          doc.data().sheetId,
          doc.data().orderId,
          {
            question: doc.data().question,
            choices: doc.data().choices,
            helpertext: doc.data().helpertext,
            showHelpertext: doc.data().showHelpertext
          }
        );
        result.push(a);
      }


    });

    return this.sortByOrderId(result);

  }

  updateTask(task: Task){
    switch(task.component){
      case ArticleComponent: this.updateArticle(task);
      break;
      case QuestionSimpleComponent: this.updateQuestionSimple(task);
      break;
      case QuestionMultipleComponent: this.updateQuestionMultiple(task);
      break;
      case QuestionMultipleOneComponent: this.updateQuestionMultipleOne(task);
      break;
      default: console.log('Task nicht bekannt');
    }
  }

  deleteTask(task: Task){
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'tasks',
      task.id
    );
    deleteDoc(ref);
  }

  /* ARTICLE *************************************/

  addNewArticle(article: Article) {
    const ref = collection(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'tasks'
    );
    return addDoc(ref, {
      orderId: article.orderId,
      sheetId: article.sheetId,
      text: article.data.text,
      helpertext: '',
      showHelpertext: article.data.showHelpertext ,
      component: 'ArticleComponent',
    });
  }

  async updateArticle(article: Article) {
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'tasks',
      article.id
    );

    await updateDoc(ref, {
      orderId: article.orderId,
      sheetId: article.sheetId,
      text: article.data.text,
      helpertext: article.data.helpertext,
      showHelpertext: article.data.showHelpertext ,
    });
  }

  async deleteArticle(id: string) {
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'tasks',
      id
    );
    await deleteDoc(ref);
  }

  /* Question Simple */

  addNewQuestionSimple(questionSimple: QuestionSimple) {
    const ref = collection(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'tasks'
    );
    return addDoc(ref, {
      orderId: questionSimple.orderId,
      sheetId: questionSimple.sheetId,
      question: questionSimple.data.question,
      helpertext: '',
      showHelpertext: questionSimple.data.showHelpertext ,
      component: 'QuestionSimpleComponent',
    });
  }

  updateQuestionSimple(questionSimple: QuestionSimple) {
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'tasks',
      questionSimple.id
    );

    updateDoc(ref, {
      orderId: questionSimple.orderId,
      sheetId: questionSimple.sheetId,
      question: questionSimple.data.question,
      helpertext: questionSimple.data.helpertext,
      showHelpertext: questionSimple.data.showHelpertext ,
    });
  }

  deleteQuestionSimple(id: string) {
    const ref = deleteDoc(
      doc(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'tasks',
        id
      )
    );
  }

  addNewQuestionMultiple(questionMultiple: QuestionMultiple) {
    const ref = collection(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'tasks'
    );
   return addDoc(ref, {
      orderId: questionMultiple.orderId,
      sheetId: questionMultiple.sheetId,
      question: questionMultiple.data.question,
      choices: questionMultiple.data.choices,
      helpertext: '',
      showHelpertext: questionMultiple.data.showHelpertext ,
      component: 'QuestionMultipleComponent',
    });
  }

  updateQuestionMultiple(questionMultiple: QuestionMultiple) {
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'tasks',
      questionMultiple.id
    );

    updateDoc(ref, {
      orderId: questionMultiple.orderId,
      sheetId: questionMultiple.sheetId,
      question: questionMultiple.data.question,
      choices: questionMultiple.data.choices,
      helpertext: questionMultiple.data.helpertext,
      showHelpertext: questionMultiple.data.showHelpertext ,
    });
  }

  deleteQuestionMultiple(id: string) {
    const ref = deleteDoc(
      doc(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'tasks',
        id
      )
    );
  }

  addNewQuestionMultipleOne(questionMultipleOne: QuestionMultipleOne) {
    const ref = collection(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'tasks'
    );
    return addDoc(ref, {
      orderId: questionMultipleOne.orderId,
      sheetId: questionMultipleOne.sheetId,
      question: questionMultipleOne.data.question,
      choices: questionMultipleOne.data.choices,
      helpertext: '',
      component: 'QuestionMultipleOneComponent',
    });
  }

  updateQuestionMultipleOne(questionMultipleOne: QuestionMultipleOne) {
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'tasks',
      questionMultipleOne.id
    );

    updateDoc(ref, {
      orderId: questionMultipleOne.orderId,
      sheetId: questionMultipleOne.sheetId,
      question: questionMultipleOne.data.question,
      choices: questionMultipleOne.data.choices,
      helpertext: questionMultipleOne.data.helpertext,
    });
  }

  deleteQuestionMultipleOne(id: string) {
    const ref = deleteDoc(
      doc(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'tasks',
        id
      )
    );
  }

  saveSheet(){
    this.sheetSaved.next(true);
  }

  getComponentFromString(nameOfComponent: string) {
    if (nameOfComponent === 'ArticleComponent') {
      return ArticleComponent;
    }

    if (nameOfComponent === 'QuestionSimpleComponent') {
      return QuestionSimpleComponent;
    }
    if (nameOfComponent === 'QuestionMultipleComponent') {
      return QuestionMultipleComponent;
    }

    if (nameOfComponent === 'QuestionMultipleOneComponent') {
      return QuestionMultipleOneComponent;
    }

    return null;
  }

  sortByOrderId(a: any[]) {
    const result = a.sort((a, b) => {
      if (a.orderId > b.orderId) {
        return 1;
      } else {
        return -1;
      }
    });

    return result;
  }

}

/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/no-shadow */
import { QuestionMultipleOne } from './../wiki/classes/questionMultipleOne';
import { QuestionMultipleOneComponent } from './../wiki/taskcomponents/question-multiple-one/question-multiple-one.component';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { QuestionMultipleComponent } from './../wiki/taskcomponents/question-multiple/question-multiple.component';
import { QuestionSimpleComponent } from './../wiki/taskcomponents/question-simple/question-simple.component';
import { Sheet } from './../wiki/classes/sheet';
import { QuestionMultiple } from './../wiki/classes/questionMultiple';
import { QuestionSimple } from './../wiki/classes/questionSimple';
import { Article } from './../wiki/classes/article';
import { Chapter } from './../wiki/classes/chapter';
import { LoadingController } from '@ionic/angular';
import { Book } from './../wiki/classes/book';
import { AuthService } from './../auth/auth.service';
import {
  Firestore,
  addDoc,
  updateDoc,
  collectionData,
} from '@angular/fire/firestore';
import {
  query,
  collection,
  getDocs,
  serverTimestamp,
  doc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { Injectable } from '@angular/core';
import { ArticleComponent } from '../wiki/taskcomponents/article/article.component';
import { Task } from '../wiki/taskcomponents/task/task';
import { resourceLimits } from 'worker_threads';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  books: Book[];
  chapters: Chapter[];
  sheets: Sheet[];
  tasks: Task[];

  currentEditedSheet: Sheet;

  loading: HTMLIonLoadingElement;
  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private loadingController: LoadingController
  ) {}

  generateId(){
    return Date.now().toString(36) + Math.random().toString(36).substring(2);

    }

  async init(): Promise<any> {
    this.loading = await this.loadingController.create();
    await this.loading.present();

    this.getAllBooks();

    this.getAllChapters();

    this.getAllSheets();

    this.getAllTasks();

    await this.loading.dismiss();
  }

  /* GETTER ALL *************************************************** */

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

    this.books = this.sortByOrderId(b);

    return this.books;
  }

  /* TODO: alles umstellen auf Promise!! */
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

    this.chapters = this.sortByOrderId(c);

    return this.chapters;
  }

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

    this.sheets = this.sortByOrderId(s);

    return this.sheets;
  }

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
          { text: doc.data().text, helpertext: doc.data().helpertext }
        );
        result.push(a);
      }

      if (doc.data().component === 'QuestionSimpleComponent') {
        const a = new QuestionSimple(
          this.getComponentFromString(doc.data().component),
          doc.id,
          doc.data().sheetId,
          doc.data().orderId,
          { question: doc.data().question, helpertext: doc.data().helpertext }
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
          }
        );
        result.push(a);
      }


    });

    this.tasks = this.sortByOrderId(result);

    return this.tasks;

  }

  /* ADD *********************************************/

  addNewBook() {
    const ref = collection(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'books'
    );
    addDoc(ref, { orderId: serverTimestamp(), title: 'Neues Modul' });
  }

  addNewChapter(bookId: string) {
    const ref = collection(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'chapters'
    );
    addDoc(ref, {
      orderId: serverTimestamp(),
      title: 'Neues Kapitel',
      bookId: bookId,
    });
  }

  addNewSheet(chapterId: string) {
    const ref = collection(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'sheets'
    );
    return addDoc(ref, {
      orderId: serverTimestamp(),
      title: 'Neues Arbeitsblatt',
      chapterId: chapterId,
    });
  }

  addNewArticle(article: Article) {
    const ref = collection(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'tasks'
    );
    return addDoc(ref, {
      orderId: article.orderId,
      text: article.data,
      helpertext: '',
      sheetId: article.sheetId,
      component: article.component,
    });
  }

  addNewQuestionSimple(sheetId: string) {
    const ref = collection(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'tasks'
    );
    addDoc(ref, {
      orderId: serverTimestamp(),
      question: 'Neue einfache Frage',
      helpertext: '',
      sheetId: sheetId,
      component: 'QuestionSimpleComponent',
    });
  }

  addNewQuestionMultiple(sheetId: string) {
    const ref = collection(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'tasks'
    );
    addDoc(ref, {
      orderId: serverTimestamp(),
      question: 'Neue Multiple Choice Frage (Mehrfachauswahl)',
      choices: ['Antwortmöglichkeit'],
      helpertext: '',
      sheetId: sheetId,
      component: 'QuestionMultipleComponent',
    });
  }

  addNewQuestionMultipleOne(sheetId: string) {
    const ref = collection(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'tasks'
    );
    addDoc(ref, {
      orderId: serverTimestamp(),
      question: 'Neue Multiple Choice Frage (Einfachauswahl)',
      choices: ['Antwortmöglichkeit'],
      helpertext: '',
      sheetId: sheetId,
      component: 'QuestionMultipleOneComponent',
    });
  }
  /**************************************************/

  updateBook(book: Book) {
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'books',
      book.id
    );

    updateDoc(ref, {
      orderId: book.orderId,
      title: book.title,
    });
  }

  updateChapter(chapter: Chapter) {
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'chapters',
      chapter.id
    );

    updateDoc(ref, {
      orderId: chapter.orderId,
      bookId: chapter.bookId,
      title: chapter.title,
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

  updateArticle(article: Article) {
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'tasks',
      article.id
    );

    updateDoc(ref, {
      orderId: article.orderId,
      sheetId: article.sheetId,
      text: article.data.text,
      helpertext: article.data.helpertext,
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

  /**************************************************/

  deleteBook(bookId: string) {
    const ref = deleteDoc(
      doc(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'books',
        bookId
      )
    );
  }

  deleteChapter(chapterId: string) {
    const ref = deleteDoc(
      doc(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'chapters',
        chapterId
      )
    );
  }

  deleteSheet(sheetId: string) {
    const ref = deleteDoc(
      doc(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'sheets',
        sheetId
      )
    );
  }

  deleteArticle(articleId: string) {
    const ref = deleteDoc(
      doc(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'tasks',
        articleId
      )
    );
  }

  deleteQuestionSimple(questionSimpleId: string) {
    const ref = deleteDoc(
      doc(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'tasks',
        questionSimpleId
      )
    );
  }

  deleteQuestionMultiple(questionMultipleId: string) {
    const ref = deleteDoc(
      doc(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'tasks',
        questionMultipleId
      )
    );
  }

  deleteQuestionMultipleOne(questionMultipleOneId: string) {
    const ref = deleteDoc(
      doc(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'tasks',
        questionMultipleOneId
      )
    );
  }

  /**************************************************/

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
}

import { Sheet } from './classes/sheet';
import { Observable } from 'rxjs';
/* eslint-disable object-shorthand */
import { DataService } from './../data/data.service';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Book } from './classes/book';
import { Chapter } from './classes/chapter';
import { Article } from './classes/article';
import { docData, addDoc, updateDoc, Firestore } from '@angular/fire/firestore';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class WikiService {

  public selectedBook: Book;
  public selectedChapter: Chapter;
  public selectedSheet: Sheet;



  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private loadingController: LoadingController,
    private data: DataService
  ) {}

  /* BOOK *************************************/

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
      'wikibooks',
      book.id
    );

    await deleteDoc(ref);
  }

  /* CHAPTER *************************************/

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

  /* ARTICLE *************************************/

  async getAllArticles() {
    const ref = query(
      collection(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'wikiarticles'
      ),
      orderBy('orderId')
    );

    const result: Article[] = [];

    const docs = await getDocs(ref);
    docs.forEach((document) => {
      result.push(
        new Article(
          document.data().title,
          document.data().text,
          document.data().id,
          document.data().chapterId,
          document.data().orderId
        )
      );
    });

    return result;
  }

  async getArticles(chapterId: string) {
    const ref = query(
      collection(
        this.firestore,
        'therapists',
        this.authService.getCurrentUser().uid,
        'wikiarticles'
      ),
      orderBy('orderId')
    );

    const result = [];

    const docs = await getDocs(ref);
    docs.forEach((document) => {
      if (document.data().chapterId === chapterId) {
        result.push(
          new Article(
            document.data().title,
            document.data().text,
            document.data().id,
            document.data().chapterId,
            document.data().orderId
          )
        );
      }
    });

    return result;
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
      component: article.component.toString(),
    });
  }

  async updateArticle(article: Article) {
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'wikiarticles',
      article.id
    );

    await updateDoc(ref, {
      text: article.data.text,
      id: article.id,
      chapterId: article.sheetId,
      orderId: article.orderId,
    });
  }

  async deleteArticle(article: Article) {
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid,
      'wikiarticles',
      article.id
    );
    await deleteDoc(ref);
  }
}

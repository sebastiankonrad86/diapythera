/* eslint-disable object-shorthand */
import { InitService } from './../init/init.service';
import { UntypedFormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Firestore } from '@angular/fire/firestore';
import { UserCredential } from 'firebase/auth';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
   public afAuth: AngularFireAuth,
    private router: Router,
    private firestore: Firestore,
    private init: InitService,
    private loadingController: LoadingController
  ) {}

  async register({ email, vorname, nachname, password }) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.sendVerificationMail(); // Sending email verification notification, when new user registers
        this.setTherapistProfile(result.user, {email, vorname, nachname});
        this.init.setInitData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  async login({ email, password }) {
    try {
      const user = await this.afAuth.signInWithEmailAndPassword(email, password);
      const check = await this.checkUserRole(user.user.uid);
      if (!check) {
        this.auth.signOut();
        return null;
      }
      return user;
    } catch (e) {
      this.loadingController.dismiss();
      return null;
    }
  }

  async logout() {
    const loading = await this.loadingController.create();
    await loading.present();
    await signOut(this.auth);
    await loading.dismiss();
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  getAuth() {
    return this.auth;
  }

    // Send email verification when new user sign up
    sendVerificationMail() {
      return this.afAuth.currentUser
        .then((user) => {
          user.sendEmailVerification();
        })
        .then(() => {
          this.router.navigate(['/verifyemail']);
        });
    }

    async checkUserRole(userId: string) {
      let result: boolean;
      const ref = doc(this.firestore, 'therapists', userId);
      await getDoc(ref).then((document) => {
        result = document.exists();
      });
      return result;
    }

    sendResetPassword(email: string){
      return this.afAuth
      .sendPasswordResetEmail(email)
      .then(() => {
        window.alert(
          'Dein Passwort wurde zurückgesetzt. Schaue in deinem E-Mail Postfach nach. Klicke auf dem Link, den du bekommen hast.'
        );
      }).then(()=>{this.router.navigate(['login']);})
      .catch((error) => {
        window.alert(error);
      });
    }

  setTherapistProfile(
    user: any,
    {email, vorname, nachname}
  ) {
    const therapistCode = Math.random().toString(36).slice(2, 9);
    const ref = doc(this.firestore, 'therapists', user.uid);
    setDoc(ref, {
      vorname: vorname,
      nachname: nachname,
      code: therapistCode,
      email: email,
      uid: user.uid,
    });
  }
}

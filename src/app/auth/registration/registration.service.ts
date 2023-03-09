import { UntypedFormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { UserCredential } from 'firebase/auth';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  docData,
  addDoc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private firestore: Firestore) {}

  generateTherapistCode() {
    return Math.random().toString(36).substr(2, 9);
  }

  setTherapistProfile(
    user: UserCredential,
    registrationForm: UntypedFormGroup
  ) {
    console.log('registrService: setProfile');
    const therapistCode = Math.random().toString(36).slice(2,9);
    const ref = doc(this.firestore, 'therapists', user.user.uid);
    setDoc(ref, {
      vorname: registrationForm.controls.vorname.value,
      nachname: registrationForm.controls.nachname.value,
      code: therapistCode,
      email: registrationForm.controls.email.value,
      uid: user.user.uid,
    });
  }
}

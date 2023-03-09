import { AuthService } from './../auth/auth.service';
import {
  Firestore,
  doc,
  docData,
  DocumentData,
  collectionData,
} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { collection, query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  getCodeForPatients(): Observable<DocumentData> {
    const ref = doc(
      this.firestore,
      'therapists',
      this.authService.getCurrentUser().uid
    );

    return docData(ref) as Observable<DocumentData>;
  }

  getAllPatients() {
    const ref = collection(this.firestore, 'patients');
    const therapistId = this.authService.getCurrentUser().uid;
    const q = query(ref, where('therapistId', '==', therapistId));
    return collectionData(q);
  }
}

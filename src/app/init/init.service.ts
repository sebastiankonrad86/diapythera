import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor() { }

  setInitData(user: User){
    /* TODO */
    console.log('setinitdata');
  }
}

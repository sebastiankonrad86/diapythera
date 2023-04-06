import { LoadingController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { HomeService } from './home.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  code: string;
  patients: string[] = [];
  subs: Subscription[]=[];

  constructor(private homeService: HomeService) {}

  ngOnInit() {
   const sub = this.homeService.getCodeForPatients().subscribe((resData) => {
      this.code = resData.code;
    });

    this.subs.push(sub);

    this.homeService.getAllPatients().subscribe((resData) => {
      const mails: string[] = [];
      resData.forEach((res) => mails.push(res.email));
      this.patients = mails;
    });
  }

  ngOnDestroy(){
    this.subs.forEach(sub=>{
      sub.unsubscribe();
    });
  }
}

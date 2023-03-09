import { LoadingController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { HomeService } from './home.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  code: string;
  patients: string[] = [];

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.homeService.getCodeForPatients().subscribe((resData) => {
      this.code = resData.code;
    });

    this.homeService.getAllPatients().subscribe((resData) => {
      resData.forEach((res) => this.patients.push(res.email));
    });
  }
}

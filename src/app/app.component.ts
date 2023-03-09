import { DataService } from './data/data.service';
import { AuthService } from './auth/auth.service';
import { Router, RouterEvent } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  active = '';

  // eslint-disable-next-line @typescript-eslint/naming-convention
  NAV = [
    {
      name: 'Start',
      link: '/home',
      icon: 'home',
    },
    {
      name: 'Wiki',
      link: '/wiki',
      icon: 'book',
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private data: DataService
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.active = event.url;
    });
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit() {
    console.log('ngOnInit component.ts');
    this.authService.getAuth().onAuthStateChanged((user) => {
      if (user) {
        //this.data.init();
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}

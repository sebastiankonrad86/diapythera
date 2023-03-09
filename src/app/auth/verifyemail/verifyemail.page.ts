import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.page.html',
  styleUrls: ['./verifyemail.page.scss'],
})
export class VerifyemailPage implements OnInit {

  constructor(    public authService: AuthService,
    private router: Router,
    private alertController: AlertController) { }

  ngOnInit() {
  }

  async toLogin() {
    await this.authService.afAuth.currentUser.then((res) => {
      res.reload();
    });
    const alert = await this.alertController.create({
      header: 'Achtung',
      message:
        'Verifiziere zuerst deine E-Mail Adresse! Falls du keine E-Mail erhalten hast, kannst du über den Button eine neue anfordern.',
      buttons: ['OK'],
    });
    await this.authService.afAuth.currentUser.then((res) => {
      if (res.emailVerified) {
        this.router.navigateByUrl('/home');
      } else {
        alert.present();
      }
    });
  }
}

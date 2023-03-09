import { RegistrationService } from './../registration/registration.service';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  registrationForm: UntypedFormGroup;
  /*submitted = false;*/

  constructor(
    private formBuilder: UntypedFormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private registerService: RegistrationService
  ) {}

  get email() {
    return this.registrationForm.get('email');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        vorname: ['', Validators.required],
        nachname: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
        confirmPassword: ['', Validators.required],
        zugangscode: ['', Validators.required],
      },
      {
        validators: [this.match('password', 'confirmPassword')],
      }
    );
  }

  async register() {

    const checkZugangscode =
      this.registrationForm.controls.zugangscode.value === 'sebastiankonrad';
        if (this.registrationForm.valid && checkZugangscode) {
          this.authService.register(this.registrationForm.value);
        }
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  /* Funktion Validator für comfirm Passwort*/
  match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl.errors && !checkControl.errors.matching) {
        return null;
      }

      if (control.value !== checkControl.value) {
        controls.get(checkControlName).setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}

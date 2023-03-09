import { AuthService } from './../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

/* ********************************* */
/* ACHTUNG: Diese Page nicht benutzen. Der User wird zur Firebase Website weitergeleitet und kann da sein neues PW angeben.*/


  sendresetemailform: UntypedFormGroup;
  resetpasswordform: UntypedFormGroup;
  /* ist hier resetPassword, gibt noch andere*/
  mode: string;
  /* Just a code Firebase uses to prove that
   this is a real password reset.*/
  actionCode: string;

  actionCodeChecked = false;
  private subs: Subscription[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  get resetEmail() {
    return this.sendresetemailform.get('resetEmail');
  }

  get password() {
    return this.resetpasswordform.get('password');
  }

  get confirmPassword() {
    return this.resetpasswordform.get('confirmPassword');
  }

  ngOnInit() {
    this.sendresetemailform = this.formBuilder.group({
      resetEmail: ['', [Validators.required, Validators.email]],
    });
    this.resetpasswordform = this.formBuilder.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
      },
      {
        validators: [this.match('password', 'confirmPassword')],
      }
    );

    this.activatedRoute.queryParams.subscribe((params) => {
      // if we didn't receive any parameters,
      // we can't do anything
      if (!params) {
        this.router.navigate(['login']);
      }

      this.mode = params.mode;
      this.actionCode = params.oobCode;

      if (this.mode === 'resetPassword') {
        this.authService.afAuth
          .verifyPasswordResetCode(this.actionCode)
          .then((email) => {
            this.actionCodeChecked = true;
          })
          .catch((e) => {
            // Invalid or expired action code. Ask user to try to reset the password
            // again.
            alert(e);
            this.router.navigate(['/auth/login']);
          });
      }
    });
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy() {
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }

  sendResetEmail() {
    this.authService.sendResetPassword(
      this.sendresetemailform.value.resetEmail
    );
  }

  resetPassword() {
    /* TODO hier jetzt dievquery params nach dem email confirm abfragen*/
    this.authService.afAuth
      .confirmPasswordReset(
        this.actionCode,
        this.sendresetemailform.value.password
      )
      .then((resp) => {
        // Password reset has been confirmed and new password updated.
        alert('New password has been saved');
        this.router.navigate(['login']);
      })
      .catch((e) => {
        // Error occurred during confirmation. The code might have
        // expired or the password is too weak. alert(e);
      });
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

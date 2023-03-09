import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-init-reset-password',
  templateUrl: './init-reset-password.page.html',
  styleUrls: ['./init-reset-password.page.scss'],
})
export class InitResetPasswordPage implements OnInit {

  form: UntypedFormGroup;
  constructor(
    private authService: AuthService,
    private formBuilder: UntypedFormBuilder,
    private router: Router
  ) {}

  get resetEmail() {
    return this.form.get('resetEmail');
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      resetEmail: ['', [Validators.required, Validators.email]],
    });
  }



  sendResetEmail() {
    this.authService.sendResetPassword(this.form.value.resetEmail);

  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InitResetPasswordPageRoutingModule } from './init-reset-password-routing.module';

import { InitResetPasswordPage } from './init-reset-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InitResetPasswordPageRoutingModule
  ],
  declarations: []
})
export class InitResetPasswordPageModule {}

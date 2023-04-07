import { SheetCreaterPage } from './sheet-creater.page';
import { QuillModule } from 'ngx-quill';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SheetCreaterPageRoutingModule } from './sheet-creater-routing.module';

import { DynamicIoModule, DynamicModule } from 'ng-dynamic-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SheetCreaterPageRoutingModule,
    DynamicModule,
    DynamicIoModule,
    QuillModule,
  ],
  declarations: [SheetCreaterPage
  ],
})
export class SheetCreaterPageModule {}

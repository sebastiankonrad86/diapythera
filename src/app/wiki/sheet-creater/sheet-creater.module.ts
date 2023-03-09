import { SheetCreaterPage } from './sheet-creater.page';
import { QuestionMultipleOneComponent } from './../taskcomponents/question-multiple-one/question-multiple-one.component';
import { QuillModule } from 'ngx-quill';
import { QuestionSimpleComponent } from './../taskcomponents/question-simple/question-simple.component';
import { QuestionMultipleComponent } from './../taskcomponents/question-multiple/question-multiple.component';
import { ArticleComponent } from './../taskcomponents/article/article.component';
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

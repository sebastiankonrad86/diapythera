import { QuestionMultipleOneComponent } from './taskcomponents/question-multiple-one/question-multiple-one.component';
import { QuestionMultipleComponent } from './taskcomponents/question-multiple/question-multiple.component';
import { QuestionSimpleComponent } from './taskcomponents/question-simple/question-simple.component';
import { ArticleComponent } from './taskcomponents/article/article.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WikiPageRoutingModule } from './wiki-routing.module';

import { WikiPage } from './wiki.page';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WikiPageRoutingModule,
    QuillModule
  ],
  declarations: [ArticleComponent, QuestionMultipleComponent, QuestionMultipleOneComponent, QuestionSimpleComponent, WikiPage
]
})
export class WikiPageModule {}

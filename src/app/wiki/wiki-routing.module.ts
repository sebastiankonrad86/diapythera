import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WikiPage } from './wiki.page';

const routes: Routes = [
  {
    path: '',
    component: WikiPage
  },
  {
    path: 'book',
    loadChildren: () => import('./book/book.module').then( m => m.BookPageModule)
  },
  {
    path: 'chapter',
    loadChildren: () => import('./chapter/chapter.module').then( m => m.ChapterPageModule)
  },  {
    path: 'sheet-creater',
    loadChildren: () => import('./sheet-creater/sheet-creater.module').then( m => m.SheetCreaterPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WikiPageRoutingModule {}

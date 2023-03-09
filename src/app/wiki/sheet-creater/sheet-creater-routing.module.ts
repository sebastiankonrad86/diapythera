import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SheetCreaterPage } from './sheet-creater.page';

const routes: Routes = [
  {
    path: '',
    component: SheetCreaterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SheetCreaterPageRoutingModule {}

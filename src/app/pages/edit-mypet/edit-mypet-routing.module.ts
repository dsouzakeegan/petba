import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditMypetPage } from './edit-mypet.page';

const routes: Routes = [
  {
    path: '',
    component: EditMypetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditMypetPageRoutingModule {}

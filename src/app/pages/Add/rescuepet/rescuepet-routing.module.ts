import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RescuepetPage } from './rescuepet.page';

const routes: Routes = [
  {
    path: '',
    component: RescuepetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RescuepetPageRoutingModule {}

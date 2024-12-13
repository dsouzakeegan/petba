import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SFilterPage } from './s-filter.page';

const routes: Routes = [
  {
    path: '',
    component: SFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SFilterPageRoutingModule {}

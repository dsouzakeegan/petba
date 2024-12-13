import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PFilterPage } from './p-filter.page';

const routes: Routes = [
  {
    path: '',
    component: PFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PFilterPageRoutingModule {}

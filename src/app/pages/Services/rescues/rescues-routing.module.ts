import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RescuesPage } from './rescues.page';

const routes: Routes = [
  {
    path: '',
    component: RescuesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RescuesPageRoutingModule {}

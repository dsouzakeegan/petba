import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyDonationsPage } from './my-donations.page';

const routes: Routes = [
  {
    path: '',
    component: MyDonationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyDonationsPageRoutingModule {}

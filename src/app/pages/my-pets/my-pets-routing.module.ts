import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyPetsPage } from './my-pets.page';

const routes: Routes = [
  {
    path: '',
    component: MyPetsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPetsPageRoutingModule {}

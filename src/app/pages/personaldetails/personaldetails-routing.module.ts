import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonaldetailsPage } from './personaldetails.page';

const routes: Routes = [
  {
    path: '',
    component: PersonaldetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonaldetailsPageRoutingModule {}

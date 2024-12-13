import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditRescuePage } from './edit-rescue.page';

const routes: Routes = [
  {
    path: '',
    component: EditRescuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRescuePageRoutingModule {}

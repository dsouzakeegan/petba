import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InboxPage } from './folder.page'; // Use InboxPage here

const routes: Routes = [
  {
    path: '',
    component: InboxPage  // Use InboxPage here
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}

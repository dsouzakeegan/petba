import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchProductpagePage } from './search-productpage.page';

const routes: Routes = [
  {
    path: '',
    component: SearchProductpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchProductpagePageRoutingModule {}

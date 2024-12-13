import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductWishlistPage } from './product-wishlist.page';

const routes: Routes = [
  {
    path: '',
    component: ProductWishlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductWishlistPageRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SFilterPageRoutingModule } from './s-filter-routing.module';

import { SFilterPage } from './s-filter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SFilterPageRoutingModule
  ],
  declarations: [SFilterPage]
})
export class SFilterPageModule {}

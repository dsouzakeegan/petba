import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PFilterPageRoutingModule } from './p-filter-routing.module';

import { PFilterPage } from './p-filter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PFilterPageRoutingModule
  ],
  declarations: [PFilterPage]
})
export class PFilterPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdoptionPageRoutingModule } from './adoption-routing.module';

import { AdoptionPage } from './adoption.page';
import { adoptionFilterModule } from 'src/app/components/adoption-filter/adoption-filter.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdoptionPageRoutingModule,adoptionFilterModule,SharedDirectivesModule
  ],
  declarations: [AdoptionPage]
})
export class AdoptionPageModule {}

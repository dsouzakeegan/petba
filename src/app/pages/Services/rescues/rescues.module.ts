import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RescuesPageRoutingModule } from './rescues-routing.module';

import { RescuesPage } from './rescues.page';
import { rescueFilterModule } from 'src/app/components/rescue-filter/rescue-filter.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RescuesPageRoutingModule,
    rescueFilterModule,SharedDirectivesModule
  ],
  declarations: [RescuesPage]
})
export class RescuesPageModule {}

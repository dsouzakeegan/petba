import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RescuepetPageRoutingModule } from './rescuepet-routing.module';

import { RescuepetPage } from './rescuepet.page';
import { mapModule } from 'src/app/components/map/map.module';
import { ImageViewModule } from 'src/app/components/image-viewer/image-viewer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RescuepetPageRoutingModule,mapModule,ImageViewModule
  ],
  declarations: [RescuepetPage]
})
export class RescuepetPageModule {}

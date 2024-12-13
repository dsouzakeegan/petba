import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RescuePageRoutingModule } from './rescue-routing.module';

import { RescuePage } from './rescue.page';
import { ImageSliderModule } from 'src/app/components/image-slider/image-slider.module';
import { pipesModule } from 'src/app/pipes/pipes.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RescuePageRoutingModule,ImageSliderModule,pipesModule,
    SharedDirectivesModule
  ],
  declarations: [RescuePage]
})
export class RescuePageModule {}

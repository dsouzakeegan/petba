import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListDetailsPageRoutingModule } from './list-details-routing.module';

import { ListDetailsPage } from './list-details.page';
import { ImageSliderModule } from 'src/app/components/image-slider/image-slider.module';
import { pipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListDetailsPageRoutingModule,ImageSliderModule,pipesModule 
  ],
  declarations: [ListDetailsPage]
})
export class ListDetailsPageModule {}

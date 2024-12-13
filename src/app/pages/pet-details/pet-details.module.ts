import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetDetailsPageRoutingModule } from './pet-details-routing.module';

import { PetDetailsPage } from './pet-details.page';
import { ImageSliderModule } from 'src/app/components/image-slider/image-slider.module';
import { pipesModule } from 'src/app/pipes/pipes.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({  
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetDetailsPageRoutingModule,ImageSliderModule,pipesModule,SharedDirectivesModule
  ],    
  declarations: [PetDetailsPage]
})
export class PetDetailsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditRescuePageRoutingModule } from './edit-rescue-routing.module';

import { EditRescuePage } from './edit-rescue.page';
import { ImageViewModule } from 'src/app/components/image-viewer/image-viewer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditRescuePageRoutingModule,ImageViewModule
  ],
  declarations: [EditRescuePage]
})
export class EditRescuePageModule {}

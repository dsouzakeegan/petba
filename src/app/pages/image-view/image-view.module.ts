import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageViewPageRoutingModule } from './image-view-routing.module';

import { ImageViewPage } from './image-view.page';
import { ImageViewModule } from 'src/app/components/image-viewer/image-viewer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageViewPageRoutingModule,ImageViewModule
  ],
  declarations: [ImageViewPage]
})
export class ImageViewPageModule {}

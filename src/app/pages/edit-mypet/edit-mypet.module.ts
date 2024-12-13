import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditMypetPageRoutingModule } from './edit-mypet-routing.module';

import { EditMypetPage } from './edit-mypet.page';
import { ImageViewModule } from 'src/app/components/image-viewer/image-viewer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditMypetPageRoutingModule,ImageViewModule
  ],
  declarations: [EditMypetPage]
})
export class EditMypetPageModule {}

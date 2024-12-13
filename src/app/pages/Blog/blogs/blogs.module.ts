import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlogsPageRoutingModule } from './blogs-routing.module';

import { BlogsPage } from './blogs.page';
import { pipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlogsPageRoutingModule,pipesModule
  ],
  declarations: [BlogsPage]
})
export class BlogsPageModule {}

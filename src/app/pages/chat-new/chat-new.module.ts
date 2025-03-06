// src/app/pages/chat-new/chat-new.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ChatNewPage } from './chat-new.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChatNewPage
      }
    ])
  ],
  declarations: [ChatNewPage]
})
export class ChatNewPageModule { }
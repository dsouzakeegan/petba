import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Ensure IonicModule is imported

import { FolderPageRoutingModule } from './folder-routing.module';
import { InboxPage } from './folder.page'; // Keep the name as InboxPage

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,  // This is needed for Ionic components
    FolderPageRoutingModule
  ],
  declarations: [InboxPage] // Use InboxPage as the component
})
export class FolderPageModule {}

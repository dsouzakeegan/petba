import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonaldetailsPageRoutingModule } from './personaldetails-routing.module';

import { PersonaldetailsPage } from './personaldetails.page';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,MaskitoModule, //IMPORTED
    PersonaldetailsPageRoutingModule
  ],
  declarations: [PersonaldetailsPage]
})
export class PersonaldetailsPageModule {}

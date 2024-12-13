import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyDonationsPageRoutingModule } from './my-donations-routing.module';

import { MyDonationsPage } from './my-donations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyDonationsPageRoutingModule
  ],
  declarations: [MyDonationsPage]
})
export class MyDonationsPageModule {}

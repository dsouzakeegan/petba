import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendOtpPageRoutingModule } from './send-otp-routing.module';

import { SendOtpPage } from './send-otp.page';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,MaskitoModule,
    SendOtpPageRoutingModule
  ],
  declarations: [SendOtpPage]
})
export class SendOtpPageModule {}

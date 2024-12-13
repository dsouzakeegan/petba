import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OfflineScreenComponent } from './offline-screen.component';
import { LottieComponent, provideLottieOptions } from 'ngx-lottie';



@NgModule({
  declarations: [OfflineScreenComponent],
  imports: [
    CommonModule,IonicModule,LottieComponent
  ],
  exports:[OfflineScreenComponent]
  ,providers:[provideLottieOptions({
    player: () => import('lottie-web'),
  })]
})
export class OfflineScreenModule { }

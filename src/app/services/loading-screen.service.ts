import { Injectable } from '@angular/core';
import { LoadingController, Platform, SpinnerTypes } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingScreenService {
  loading!: HTMLIonLoadingElement;

 
  
  constructor( private loadingCtrl : LoadingController,private platform: Platform) { 
    
  }

  async presentLoading(message:string="Loading..." ,spinner:SpinnerTypes="crescent", duration?:number|undefined,cssClass?:string,backdropDismiss:boolean=false,showBackdrop:boolean=true,) {

 
    this.loading = await this.loadingCtrl.create({
      message: message,
      duration,
      spinner:spinner,
      cssClass,
      animated:true,
      showBackdrop:showBackdrop,
      backdropDismiss:backdropDismiss
    });
  

    await this.loading.present();
  }
  async CreateLoader(message:string="Loading..." ,spinner:SpinnerTypes="crescent", duration?:number|undefined,cssClass?:string,backdropDismiss:boolean=false,showBackdrop:boolean=true,) {

    
 
    const loader = await this.loadingCtrl.create({
      message: message,
      duration,
      spinner:spinner,
      cssClass,
      animated:true,
      showBackdrop:showBackdrop,
      backdropDismiss:backdropDismiss
    });
  

    return loader;
  }

   async dismissLoading()
  {
   await this.loading.dismiss()
     

  }
}

import { inject, Injectable } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastCtrl = inject(ToastController)
  constructor() { }
  async presentToast(message:string,color:string,duration:undefined|number,position:'top'|'middle'|'bottom'='bottom', positionAnchor:'footer'|'header'|undefined=undefined)
  {
  // var positionAnchor:'footer'|'header'|undefined=undefined;
  // if(position==="bottom")
  //   {
  //     positionAnchor="footer"
  //   }else if(position==="top")
  //     {
  //       positionAnchor="header";
  //     }
    let toastOptions:ToastOptions ={
      message:message,
    color:color,
    cssClass: 'custom-toast',
    position:position,
    animated:true,
    duration:duration,
    swipeGesture:'vertical',
    keyboardClose:true,
    positionAnchor
    
    }
     let toast = await this.toastCtrl.create(toastOptions)
     toast.present();
  }
  async createToast(message:string,color:string,duration:undefined|number,position:'top'|'middle'|'bottom'='bottom', positionAnchor:'footer'|'header'|undefined=undefined, cssClass:string='custom-toast')
  {
  // var positionAnchor:'footer'|'header'|undefined=undefined;
  // if(position==="bottom")
  //   {
  //     positionAnchor="footer"
  //   }else if(position==="top")
  //     {
  //       positionAnchor="header";
  //     }
    let toastOptions:ToastOptions ={
      message:message,
    color:color,
    position:position,
    animated:true,cssClass,
    duration:duration,
    swipeGesture:'vertical',
    keyboardClose:true,
    positionAnchor
    
    }
     return await this.toastCtrl.create(toastOptions);
    //  toast.present();
  }
}

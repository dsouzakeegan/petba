import { Injectable } from '@angular/core';
import { AlertButton, AlertController, AlertOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor(private alertCtrl :AlertController,) { }


  async present(header:string|undefined,buttons:(AlertButton | string)[],message?:string|undefined,subHeader?:string|undefined,cssClass?:string) {
    console.warn("alert service provider ...");
    let options:AlertOptions={
      header,
      subHeader,
      message,
      buttons,
      cssClass
    } 
    const alert = await this.alertCtrl.create(options);

   await alert.present();
  }

  async create(header:string|undefined,buttons:(AlertButton | string)[],message?:string|undefined,subHeader?:string|undefined,cssClass?:string,backdropDismiss:boolean=true) {
    console.warn("alert service provider ...");
    let options:AlertOptions={
      header,
      subHeader,
      message,
      buttons,
      cssClass,
      backdropDismiss
    } 
    const alert = await this.alertCtrl.create(options);

   return  alert;
  }
}

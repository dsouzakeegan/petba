import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
// import { AuthServiceService } from '../auth-service.service';
import { AuthServiceService } from '../auth-service.service';
// import { BehaviorSubject } from 'rxjs';

export const FCM_TOKEN = 'Fcm_Token';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  UserId:string="48";
  router =inject(Router);
  authService =inject(AuthServiceService);
  // private _redirect = new BehaviorSubject<any>(null);

  // get redirect() {
  //   return this._redirect.asObservable();
  // }

  constructor() {
    // this.UserId = JSON.parse(localStorage.getItem('userData')!).userData.customer_id ?? "48";
  }

  initPush() {
    if(Capacitor.getPlatform() !== 'web') {
      this.registerPush();
      // this.getDeliveredNotifications();
    }
  }

  private async registerPush() {
    try {
      await this.addListeners();
      let permStatus = await PushNotifications.checkPermissions();

      console.log("Permission : ",permStatus.receive)
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
        console.log("Permission : ",permStatus.receive)
      }

      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();
    } catch(e) {
      console.log(e);
    }
  }

  // async getDeliveredNotifications() {
  //   const notificationList = await PushNotifications.getDeliveredNotifications();
  //   console.log('delivered notifications', notificationList);
  // }

  addListeners() {
    // Register
    PushNotifications.addListener(
      'registration',
      async(token: Token) => {
        console.log('My token: ', token);
        const fcm_token = (token?.value);
        // let go = 1;
        const saved_token =(localStorage.getItem(FCM_TOKEN))!;
        if(saved_token) {
          if(fcm_token == saved_token) {
            console.log('same token');
            // go = 0;
          } else {
            localStorage.setItem(FCM_TOKEN, fcm_token);
            // go = 2;
          }
        }else{
         localStorage.setItem(FCM_TOKEN, fcm_token);
        }
      
        this.updateFCMToken(fcm_token);
      }
    );

    //Register Error
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error(error);
    });

    // Get Notification 
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        console.log(notification);
        // const data = notification?.data;
        // this.saveNotifications(notification)

        
      }
    );

    // action to perform when clicked
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification:ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        console.log('push data: ', data);
        
        // redirect
        if(data?.type == 'rescue' && data?.id) 
        {
          this.router.navigateByUrl(`/rescue/${data.id}`)
        }
        else if(data?.type == 'rescue_comment' && data?.id)
        {
          this.router.navigateByUrl(`/rescue/${data.id}`)
          
        }
        else if(data?.type == 'message' && data?.id)
        {
          console.error("Goto chat!! "+data.id);
          
        }
        else if(data?.type == 'orderUpdates')
        {
          this.router.navigateByUrl(`/my-orders`)
          
        }else if(data?.type == 'blog')
          {
            this.router.navigateByUrl(`/blog/${data.id}`)
            
          };
        

      }
    );
  }

  updateFCMToken(token:string)
  {   
    
    let saveTokenParam= {
    c_id: this.UserId,
    d_id: token }
 
    this.authService.postData(saveTokenParam,'saveToken').then(()=>{
      console.log("saved token");
    }).catch((error)=>{console.error(error)});
    
  }
  // saveNotifications(data:any)
  // {
  //   let param = {
  //     c_id: this.UserId,
  //     type: data.data.type,
  //     title: data.title,
  //     body: data.body,
  //     data: data.data.id

  // }
  // this.authService.postData(param, "saveNotification").then(
  //   (result:any) => {
     

  //     if (result.saveNotification) {
  //       // console.log(result.saveNotification);
  //     } else {
  //       console.log("Failed");
  //     }
  //   }).catch((err) => {
  //     console.error(err);
  //   });
  // }
  async removeFcmToken() {
    try {
      // const saved_token = JSON.parse((await localStorage.getItem(FCM_TOKEN))!);;
      localStorage.removeItem(FCM_TOKEN);
    } catch(e) {
      console.log(e);
      throw(e);
    }

  }
}

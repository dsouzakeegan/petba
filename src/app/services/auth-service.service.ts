import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { OfflineScreenComponent } from '../components/offline-screen/offline-screen.component';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private modalCtrl: ModalController) {}
  
  img() {
    return `${environment.imgUrl}Api/`;
  }
  img2() {
    return `${environment.imgUrl}image/`;
  }
  blogImg() {
    return `${environment.imgUrl}blogImg/`;
  }
  img3() {
    return `${environment.imgUrl}`;
  }

  async postData(credentials: any, type: string) {
    // Check if online before attempting to make a request
    let isOnline = await this.checkNetworkstatus();
    console.log(isOnline);
    
    // Show offline screen until the network is restored
    while (!isOnline) {
      await this.showOfflineScreen();
      isOnline = await this.checkNetworkstatus();
    }

    const params = JSON.stringify(credentials);
    console.log(`${type} - Request Params: ${params}`);

    return await new Promise<object>((resolve, reject) => {
      this.doPost(`${environment.apiUrl}${type}`, params)
        .then((res) => {
          console.log(`POST request made to: ${environment.baseUrl}${type}`);
          
          // Attempt JSON parsing with improved error handling
          try {
            // Check if the response data is JSON-compatible
            if (typeof res.data === 'string' && (res.data.startsWith('{') || res.data.startsWith('['))) {
              const result = JSON.parse(res.data);
              console.log("Parsed JSON Result:", result); // Changed from warn to log
              resolve(result);
            } else {
              console.error("Received non-JSON response:", res.data);
              reject(new Error("Received non-JSON response"));
            }
          } catch (error) {
            console.warn("JSON Parsing Error:", error);
            console.warn("Server Raw Response:", res.data);
            reject(new Error("Error parsing server response."));
          }
        })
        .catch((err) => {
          console.error("HTTP Request Error:", err);
          reject(err);
        });
    });
  }

  async showOfflineScreen() {
    const offlineScreen = await this.modalCtrl.create({
      component: OfflineScreenComponent,
    });
    await offlineScreen.present();
    await offlineScreen.onWillDismiss();
  }

  async doPost(url: string, params: any) {
    const options: HttpOptions = {
      url,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      data: params,
    };
    const resp = await CapacitorHttp.request(options);
    return resp;
  }

  async checkNetworkstatus() {
    const status = await Network.getStatus();
    return status.connected;
  }
}
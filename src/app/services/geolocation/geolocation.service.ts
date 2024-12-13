import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
// import { Capacitor } from '@capacitor/core';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';

@Injectable({
  providedIn: 'root'
})

export class GeolocationService {
  defaultCoordinates={
    latitude:0,longitude:0
  }

  constructor() {
    // this.getCurrentLocation();
   }
//  async getCurrentLocationdumbby()
//   {
//     const permissions = await Geolocation.checkPermissions();
//     console.log('Permission:', permissions);

//     const coordinates = await Geolocation.getCurrentPosition();

//   console.log('Current position:', coordinates);
//   }
  async getCurrentLocation(highAccuracy:boolean=false,timeout=10000,age=3000) {
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      console.log('Permission status: ', permissionStatus.location);
      if(permissionStatus?.location != 'granted') {
        const requestStatus = await Geolocation.requestPermissions();
        if(requestStatus.location != 'granted') {
        // go to location settings
          await this.openSettings(true);
          return  {location:"",status:404};
        }
      }

      // if(Capacitor.getPlatform() == 'android') {
      //   // this.enableGps();
      // }
      let options: PositionOptions ;
if(highAccuracy == true)
{

  options= {
    maximumAge: age,
    timeout: timeout,
    enableHighAccuracy: true
  };
}else{
   options = {
    maximumAge: age,
    timeout: timeout,
  };

}
      const position:Position = await Geolocation.getCurrentPosition(options);
      console.log(position);
      return {location:position,status:200};//
    } catch(e: any) {
      if(e?.message == 'Location services are not enabled') {
        await this.openSettings();
      }
      return  {location:"",status:404};//
      console.log(e);
    }
  }
  openSettings(app = false) {
    console.log('open settings...');
    return NativeSettings.open({
      optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Location, 
      optionIOS: app ? IOSSettings.App : IOSSettings.LocationServices
    });
  }
  // async enableGps() {
  //   const canRequest = await this.locationAccuracy.canRequest();
  //   if(canRequest) {
  //     await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
  //   }
  // }
}


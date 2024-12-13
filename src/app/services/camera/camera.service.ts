import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { App } from '@capacitor/app';
import { Camera, CameraPluginPermissions, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}
const restoreSateKey="restoreState";

@Injectable({
  providedIn: 'root'
})
 
export class CameraService {

  constructor(  private platform: Platform,private router : Router) {
    
   }


   createRestorePoint()
   {
    let restoreSateParams:{path:string,data?:any} = {
      path: this.router.url,
    }
   
    // if(localStorage.getItem(restoreSateKey))
    // {
    //   localStorage.removeItem(restoreSateKey);
    // }
    localStorage.setItem(restoreSateKey,JSON.stringify(restoreSateParams));

   }

  async getCamera()
  {
   
    this.createRestorePoint();


    let CameraOptions:ImageOptions={
      resultType: CameraResultType.Base64, // file-based data; provides best performance
      source: CameraSource.Prompt, // automatically take a new photo with the camera
      quality: 100// highest quality (0 to 100) 
      ,promptLabelPicture:'Camera', promptLabelPhoto :'Choose from Gallery',promptLabelHeader:'Photos'
      
    }


  
        const capturedPhoto = await Camera.getPhoto(CameraOptions);
        const base64Data = this.convertToBase64Jpeg(capturedPhoto);
        console.log(capturedPhoto);
        return {image:base64Data,status:200};

  }
  public async addNewToGallery() {
    // Take a photo
    console.log('Checking Platform..')
    if (this.platform.is('hybrid')) {
      console.log('Checking permission..')
      const permission = await this.checkpermission()
     if(permission)
     {
    
        return await this.getCamera();
          // return base64Data;
        }
        return {image:'',status:404};
      
    }else{
      return await this.getCamera();
    }
    
   }

  convertToBase64Jpeg(picture:Photo){
    // const RemoveString =`data:image/${picture.format};base64,`
    const AddString =`data:image/jpeg;base64,`
    let ImageString = AddString + picture.base64String;
    return ImageString;

  }
 async checkpermission()
 {
  const {camera,photos} = await Camera.checkPermissions();
    //if camera permission is denied
    if(camera !== 'granted' || photos !== 'granted')
    {
      // let reqPermission:CameraPluginPermissions ={permissions:['camera']} 
     const newCameraPermission = await Camera.requestPermissions();
     if(newCameraPermission.camera !== 'granted' || newCameraPermission.photos !== 'granted' )
     {
      this.openSettings();
      return  false;
     }
    }
    return true;
  
 }

 openSettings(app = false) {
  console.log('open settings...');
  return NativeSettings.open({
    optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Privacy, 
    optionIOS: app ? IOSSettings.App : IOSSettings.Photos
  });
}
}

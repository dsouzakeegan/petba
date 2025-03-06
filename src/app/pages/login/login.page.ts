import { Component, inject, OnInit } from '@angular/core';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import { NavigationExtras } from '@angular/router';
import { IonInput, ModalController, NavController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { pageOtpType } from 'src/app/interfaces/pageType';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';
import { SendOtpPage } from '../phoneVerification/send-otp/send-otp.page';
import { ToastService } from 'src/app/services/common/toast.service';

const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9\.]*@[a-zA-Z0-9]{4,10}\.(com|co|in)$/;
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss','../signup/signup.page.scss'],
})
export class LoginPage implements OnInit {
  private toastCntrl= inject(ToastService);
  private loader: HTMLIonLoadingElement | undefined;

  eyeIcon="eye";
  constructor(
    private myApp:AppComponent,
    private authService:AuthServiceService,
    private loadingCtrl:LoadingScreenService,
    private alertCtrl:AlertServiceService,
    private navCtrl :NavController,
    private modalCntrl :ModalController,

  ) {

   }

  ngOnInit() {
    this.myApp.checkLoggedIn() ? this.navCtrl.navigateRoot('/home'):this.myApp.menuCntrl.enable(false,"petba-main-menu");
  }
  loginForm = new FormGroup(
    {
      username:new FormControl('',[Validators.required,Validators.email,Validators.pattern(emailRegex)]),
      password:new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(30)])
    }
  );
  get username():FormControl
{
  return this.loginForm.controls['username']
}
  get password():FormControl
{
  return this.loginForm.controls['password']
}

  togglepasswordVisibilty(field:IonInput)
  {
 
    if(field.type==='password')
      {
        field.type='text';
      }else{
        field.type='password';
      }
  }
 

async login(e: FormGroup) {
  const buttonOptions = [
    {
      text: 'Ok',
      cssClass: 'button-color-primary button-text-capitalize',
      role: 'confirm',
      handler: () => {
        console.log('OK pressed');
      },
    },
  ];

  console.log('authenticating...');

  if (e.valid) {
    const params: { username: string; d_id: string; password: string } = e.value;
    params.d_id = localStorage.getItem('token') || '';

    try {
      this.loader = await this.loadingCtrl.CreateLoader(
        'Signing in...',
        'circular',
        undefined,
        'loading-transparent-bg'
      );
      await this.loader.present();

      const response = await this.authService.postData(params, 'login');
      let res;

      // Attempt to parse the response as JSON
      try {
        res = typeof response === 'string' ? JSON.parse(response) : response;
      } catch (parseError) {
        console.error("Received non-JSON response:", response);
        throw new Error("Server returned an unexpected response format.");
      }

      if (res.userData) {
        localStorage.setItem('userData', JSON.stringify(res));
        this.navCtrl.navigateRoot('/home');
      } else {
        console.error(res.error?.text || "Unknown error");
        this.alertCtrl.present(
          'Oops! login failed',
          buttonOptions,
          '<small>The username or password you entered is incorrect. Please try again.</small>',
          '',
          'custom-alert-1'
        );
      }
    } catch (err) {
      console.error(err);
      this.alertCtrl.present(
        'Oops..',
        buttonOptions,
        '<small>Something went wrong. Please try again later.</small>',
        '',
        'custom-alert-1'
      );
    } finally {
      if (this.loader) {
        await this.loader.dismiss();
        this.loader = undefined;
      }
    }
  } else 
  {
    this.toastCntrl.presentToast(
      'Required fields are empty or incorrect. Please fill them in.',
      'dark',
      1500,
      'bottom'
    );
  }
}

  
 async forgotPassword(){
   const pageType:pageOtpType="forgotPassword"
    const modal = await this.modalCntrl.create({
      component: SendOtpPage,
      componentProps:{pageType:pageType},
      id:"send-otp"
    });
   await modal.present();
    const { data, role } = await modal.onWillDismiss();
      
    if (role === 'confirm') {
      console.log("goto new password");
      console.log(data);
      const params :NavigationExtras={
        skipLocationChange:false,
        state:{
          c_id:data
        }
      }
      this.navCtrl.navigateForward('new-password',params)
      
    }
  }


}

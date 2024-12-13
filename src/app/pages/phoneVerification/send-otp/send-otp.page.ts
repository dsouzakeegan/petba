import { Component, OnInit } from '@angular/core';
// import { NavigationExtras } from '@angular/router';
import { ModalController,  NavParams } from '@ionic/angular';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { ToastService } from 'src/app/services/common/toast.service';
import { VerifyOtpPage } from '../verify-otp/verify-otp.page';
import { pageOtpType } from 'src/app/interfaces/pageType';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';

@Component({
  selector: 'app-send-otp',
  templateUrl: './send-otp.page.html',
  styleUrls: ['./send-otp.page.scss'],
})
export class SendOtpPage {
  pageType:pageOtpType=undefined;
  phoneNumber:string='';
  readonly phoneMask: MaskitoOptions = {
    mask: ['+','9', '1',' ',/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/],
  };

  readonly maskPredicate: MaskitoElementPredicate = (el: HTMLElement) => {
    return (el as HTMLIonInputElement).getInputElement();
  };

  constructor(
    private navParams: NavParams,
    private toastCntrl:ToastService,
    private loadingScreen:LoadingScreenService,
    private modalCtrl:ModalController,
    private authService:AuthServiceService
  ) { 
    const data = this.navParams.get('pageType');
    console.log(data)
    if(data) this.pageType=data;

  }

  async checkNumber(mobile: string, INDMobile: string) {
    const loader = await this.loadingScreen.CreateLoader("Checking", "circular", undefined, "loading-transparent-bg");
    await loader.present();
    
    try {
      const res: any = await this.authService.postData({ phone: mobile }, "checkAccount");
      console.log('API Response:', res); // Log the API response
  
      // Check if user exists associated with number 
      if (this.pageType == "forgotPassword") {
        if (res.resp == null) {
          this.toastCntrl.presentToast("Please enter a valid number associated with the account", "dark", 3000, "bottom");
        } else if (res.resp.cid) {
          this.gotoVerifyPage(INDMobile, res.resp.cid);
        }
      } else if (this.pageType == "signup") {
        if (res.resp == null) {
          this.gotoVerifyPage(INDMobile, mobile);
        } else if (res.resp.cid) {
          this.toastCntrl.presentToast("Account already exists", "dark", 3000, "bottom");
        }
      }
    } catch (error) {
      console.error(error);
      this.toastCntrl.presentToast("An error occurred while checking the number", "dark", 3000, "bottom");
    } finally {
      loader.dismiss();
    }
  }
  
  // generateOtp()
  // {
  //   const INDMobile = this.phoneNumber.replace(/ /g,'');
  //   const mobile = this.phoneNumber.split(' ')[1];
  //   console.log(mobile)
  //   if(INDMobile.length === 13)
  //     {

  //   // let params :NavigationExtras={
  //   //   skipLocationChange:false,
  //   //   state:{
  //   //     mobileNumber:mobile
  //   //   }
  //   // }
  //   // //console.log(str)
  //   // this.nav.navigateForward(`/verify-otp`,params);
  //   // this.gotoVerifyPage(INDMobile);
  //   this.checkNumber(mobile,INDMobile);
  // }else{
  //   console.error("given number is not a Valid 10 Digit Number");
  //   this.toastCntrl.presentToast(" Kindly use a valid an active mobile number for the verification ","custom-light",5000,"bottom")
  // }

  // }

  generateOtp() {
    const INDMobile = this.phoneNumber.replace(/ /g, '');
    const mobile = this.phoneNumber.split(' ')[1];
    console.log(mobile);
    if (INDMobile.length === 13) {
      this.checkNumber(mobile, INDMobile);
    } else {
      console.error("Given number is not a valid 10-digit number");
      this.toastCntrl.presentToast("Kindly use a valid and active mobile number for the verification", "custom-light", 5000, "bottom");
    }
  }
  

  async gotoVerifyPage(mobile:string,datapass?:string) {

    if(this.pageType!== undefined)
      {
        const modal = await this.modalCtrl.create({
          component: VerifyOtpPage,
          componentProps:{mobile}
        });
        modal.present();
    
        const { data, role } = await modal.onWillDismiss();
    
        if (role === 'confirm') {
          
          if(this.pageType == "forgotPassword"){
            console.warn(" goto new password  : ",datapass);
            this.UserVerified(datapass); //send Customer id 
          }else if(this.pageType == "signup")
            {
              this.UserVerified(datapass); 
              console.warn("goto signup : ",datapass); //send Mobile 
            }else{
              console.warn(`not redirected for : `,this.pageType);
            }
            // return this.modalCtrl.dismiss(, 'confirm');
          } 
          // this.back();
        }else{
          // this.modalCtrl.dismiss(null, 'cancel'); 
          console.error("PageType is undefined ")
          // this.back();
      }
   
  }
  back()
  {
    return this.modalCtrl.dismiss(null, 'cancel',"send-otp");
  }
  UserVerified(data:any){
    return this.modalCtrl.dismiss(data, 'confirm',"send-otp"); 
  }

  // async checkNumber(mobile:string,INDMobile:string)
  // {
  //   const loader = await this.loadingScreen.CreateLoader("Checking","circular",undefined,"loading-transparent-bg");
  //   loader.present();
  //       this.authService.postData({phone:mobile},"checkAccount").then((res :any)=>{
  //         // check if user exists associated with number 
  //         if(this.pageType=="forgotPassword")
  //           {
              
  //             //  if exists then goto send otp
  //           if(res.resp == null)
  //             {
  //               // if not exists do not go 
  //               this.toastCntrl.presentToast("please enter a valid number associated with the account","dark",3000,"bottom");
  //             }else if(res.resp.cid){
  //               this.gotoVerifyPage(INDMobile,res.resp.cid);
  //             }
      
      
  //           }else if( this.pageType == "signup")
  //             {
  //               // check if user has account with the  number 
  //               // if not then goto verify 
      
                
  //               //  if not exists then goto send otp
  //               if(res.resp == null)
  //                 {
  //                   this.gotoVerifyPage(INDMobile,mobile);
  //                 }else if(res.resp.cid){
  //                   // if exists then do not go 
  //                   this.toastCntrl.presentToast("Account already exists","dark",3000,"bottom");
  //             }
      
                
  //             }
  //       }).catch((error)=>{console.error(error);
  //       }).finally(()=>{
  //         loader.dismiss();
  //       })
  // }

  
  
}

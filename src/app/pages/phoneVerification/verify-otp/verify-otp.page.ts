import { Component, OnInit, inject } from '@angular/core';
import { Auth, ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from '@angular/fire/auth';
import {  Router } from '@angular/router';
import {  ModalController, NavController, NavParams, ToastController, ToastOptions } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.scss'],
})
export class VerifyOtpPage implements OnInit {
  // isConfrimationPopoverOpen=true;

  isSendingOtpPopoverOpen=false;
  recaptchaVerifier!:RecaptchaVerifier;
  ConfirmationResult!:ConfirmationResult;
  otp: string = '';
  phoneNumber:string = ''
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private navCntrl= inject(NavController);
  private fireAuth= inject(Auth);
  isResendButtonDisabled: boolean=true;
  countdown: number= 180;
  // countdownInterval!: NodeJS.Timeout;
  countdownInterval!: ReturnType<typeof setInterval>;

  constructor(private loadingCtrl : LoadingScreenService,
    private alertCntrl : AlertServiceService,
    private modalCtrl : ModalController,
    private navParams : NavParams,

  ) {
    // const data = this.router.getCurrentNavigation()?.extras.state!;
    const data = this.navParams.get('mobile');
    console.log(data)
    if(data) this.phoneNumber=data;

          //  This resolves the reCAPTCHA automatically, allowing you to pass the phone number without manually solving it
      // this.fireAuth.settings.appVerificationDisabledForTesting = true;
    this.presentConfirmNumberAlert();
    
  }

  ngOnInit() {
    this.setIpFocus();
  }
  setIpFocus() {
    for (let i = 1; i <= 6; i++) {
      if (this.otp.length + 1 == i) {
        document.getElementById('ip' + i)!.style.background =
          'var(--ion-color-dark)';
      } else {
        document.getElementById('ip' + i)!.style.background =
          'var(--ion-color-light)';
      }
    }
  }
  clear() {
    this.otp = '';
    this.setIpFocus();
  }
  back() {
    // removes last chracter
    this.otp = this.otp.slice(0, -1);
    this.setIpFocus();
  }
  set(number: string) {
    if (this.otp.length < 6) {
      this.otp += number;
      this.setIpFocus();
      if (this.otp.length == 6) {
        // Loading screen
        this.checkOtp();
      }
    }
  }
 async checkOtp() {
    // setTimeout(() => {
    //   if (this.otp == '000000') {
    //     console.warn('Otp Verified');
    //     this.presentToast("Otp Verified ","success",3000,"bottom" );
    //     this.navCntrl.navigateForward('new-password')
        

    //   } else {
    //     console.error('Invalid Otp');
    //     this.presentToast("Invalid OTP","danger",3000,"bottom" );
    //   }
    //   this.loadingCtrl.dismissLoading();
    // }, 5000);
if(this.ConfirmationResult)
  {
    const loader = await this.loadingCtrl.CreateLoader("Verifying OTP","dots",undefined,"custom-loader",false);
    await loader.present();
    this.ConfirmationResult.confirm(this.otp).then((result) => {
          // User signed in successfully.send
          // const user = result.user;
          // console.log("otp verified successfully")
          // console.log(result)
          this.presentToast("Otp verified successfully","primary",3000,"bottom","footer");
          this.otpVerified();
          // ...
        }).catch((error) => {
          console.error("User couldn't sign in (bad verification code?)")
          console.error(error)
        this.presentToast(" OTP is invalid","danger",3000,"bottom","footer" );

          // User couldn't sign in (bad verification code?)
          // ...
        }).finally(async ()=>{
     await loader.dismiss();
        });
  }else{
    this.presentToast("Something went wrong, please try again later","custom-light",1500,"bottom","footer");
  }
    
  }
  // ngAfterViewInit(){}

 async getOtp()
  {
  this.recaptchaVerifier = new  RecaptchaVerifier(this.fireAuth,"recaptcha-container",{
  'size': 'invisible',
  'callback': (response:any) => {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    console.log("Recaptha resolved....");
    console.log(response);
    

  },
  'expired-callback': (response:any) => {
    // Response expired. Ask user to solve reCAPTCHA again.
    console.log(response);
    // ...
  }
  }  )

  // this.recaptchaVerifier.render();
 await signInWithPhoneNumber(this.fireAuth, this.phoneNumber, this.recaptchaVerifier)
  .then((confirmationResult) => {
    // SMS sent. Prompt user to type the code from the message, then sign the user in with confirmationResult.confirm(code).
    // console.warn(confirmationResult);


    // console.warn("SMS sent...");
    this.presentToast(" SMS OTP is sent to your inbox ","custom-light",1500,"bottom","footer" );

    this.ConfirmationResult = confirmationResult;
    
    // ...
  }).catch((error) => {
    // Error; SMS not sent
    console.error("SMS not sent...");
    this.presentToast("Too many requests, try again later","custom-light",1500,"bottom","footer" );
    console.error(error); 
    // ...
  }).finally(()=>{
    if(this.isSendingOtpPopoverOpen) this.sendOtpPopoverOpen(false);
  });


  }
  async presentToast(message:string,color:string,duration:undefined|number,position:'top'|'middle'|'bottom'='bottom',positionAnchor:'footer'|'header'|undefined=undefined)
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
     
  startCountdown() {
    this.isResendButtonDisabled = true; // Disable the Resend button
    this.countdown = 300;
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.stopCountdown();
        this.isResendButtonDisabled = false; // Enable the Resend button
      }
    }, 1000); // Update the countdown every 1 second
  }

  stopCountdown() {
    clearInterval(this.countdownInterval);
  }

  resendOtp() {
    // Implement the logic to resend the OTP
    // this.isResendButtonDisabled = true; // Disable the Resend button
    // this.countdown = 180; // Reset the countdown to 3 minutes
    this.startCountdown(); // Start the countdown again
    this.getOtp()
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${this.twoDigitString(minutes)}:${this.twoDigitString(remainingSeconds)}`;
  }

  private twoDigitString(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  editNumber()
  {
    // this.ConfirmNumberPopoverOpen(false); //Close Popover
    // this.navCntrl.back(); //Go Back to Previous Page (SEND-OTP Page)
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  otpVerified(){
    return this.modalCtrl.dismiss(this.phoneNumber, 'confirm');
  }
  // SEND OTP 
  sendOtp()
  {

    // this.ConfirmNumberPopoverOpen(false); //Close the Confirmation Popover

    //Open Send OTP Popover
    this.sendOtpPopoverOpen(true);

    // Get OTP from Firebase
    this.getOtp();
     

    // Start CountDown
    this.startCountdown();

  }

  // Confirm Phone Number Popover
  // ConfirmNumberPopoverOpen(state:boolean)
  // {
  //   this.isConfrimationPopoverOpen=state;
  // }

  // Send OTP Popover
  sendOtpPopoverOpen(state:boolean)
  {
    this.isSendingOtpPopoverOpen=state;
  }
  ngOnDestroy()
  {
    console.log("GOING TATA BYE BYE")
    if(this.isSendingOtpPopoverOpen) this.sendOtpPopoverOpen(false);
    // if(this.isConfrimationPopoverOpen) this.ConfirmNumberPopoverOpen(false);
  }

  async presentConfirmNumberAlert()
  { let  buttonOptions = [
     
    {
      text: 'Send OTP',
      cssClass:'button-color-danger button-text-capitalize',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
        this.sendOtp(); 
      },
    },
    {
      text: 'No, edit number',
      role: 'cancel',
      cssClass:'button-text-capitalize',
      handler: () => {
        console.log('Alert canceled');
        this.editNumber();
      },
    },
  ];
  const msg = ` <b><ion-text class="ion-custom-color-dark">One Time Password(OTP)</ion-text></b> will be sent to this <span class="ion-custom-color-primary">${this.phoneNumber}</span> number.<br/> Are you sure ?`
   const confirmPopover = await this.alertCntrl.create("Confirm your Number",buttonOptions,msg,"","custom-alert-1",false);
    confirmPopover.present();
  }
}

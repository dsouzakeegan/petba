import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonCheckbox, IonInput, ModalController, NavController } from '@ionic/angular';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { pageOtpType, pageAddRescueCityType } from 'src/app/interfaces/pageType';
import { MatchFields } from 'src/app/validators/matchingField';
import { SendOtpPage } from '../phoneVerification/send-otp/send-otp.page';
import { RescueCityComponent } from 'src/app/components/city/rescue-city/rescue-city.component';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { ToastService } from 'src/app/services/common/toast.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';
import { CommonModule } from '@angular/common';


// const emailRegex=/^[a-zA-z0-9][a-zA-Z0-9\.]+@[a-zA-Z0-9]{4,10}\.(com|co)$/; 
const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9\.]*@[a-zA-Z0-9]{4,10}\.(com|co|in)$/;

// const emailRegex=/^[^\s][^\s@]{2,}@[^\s@]+\.[^\s@]+$/; 
const phoneRegex=/\d{10}/;
const nameRegex=/^[a-zA-Z]+$/;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  private modalCntrl = inject(ModalController);
  private alertCntrl= inject(AlertServiceService);
  private toastCntrl= inject(ToastService);
  private authService= inject(AuthServiceService);
  private loadingScreen= inject(LoadingScreenService);
  private navCtrl= inject(NavController);
  previousVerifiedPhone:string='';
  Verified:boolean=false;
  // rescueChecked:boolean=false;
  RescueAddedText: string="";
  RescueCityAdded:{city_id:string}[]=[];
  constructor() { }
signupForm = new FormGroup({
  fname:new FormControl('',[Validators.required,Validators.pattern(nameRegex)]),
  lname:new FormControl('',[Validators.required,Validators.pattern(nameRegex)]),
  email:new FormControl('',[Validators.required,Validators.email,Validators.pattern(emailRegex)]),
  phone:new FormControl('',[Validators.required,Validators.pattern(phoneRegex)]),
  password:new FormControl('',[Validators.required,Validators.minLength(8),Validators.maxLength(30)],),
  confirmPassword:new FormControl('',[Validators.required])
},MatchFields('confirmPassword','password'))

readonly phoneMask: MaskitoOptions = {
  mask: [/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/],
};
//readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();
readonly maskPredicate: MaskitoElementPredicate = (el: HTMLElement) => {
  return (el as HTMLIonInputElement).getInputElement();
};

get fname():FormControl
{
  return this.signupForm.controls['fname']
}
get lname():FormControl
{
  return this.signupForm.controls['lname']
}
get email():FormControl
{
  return this.signupForm.controls['email']
}
get phone():FormControl
{
  return this.signupForm.controls['phone']
}
get password():FormControl
{
  return this.signupForm.controls['password']
}
get confirmPassword():FormControl
{
  return this.signupForm.controls['confirmPassword']
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

checkForm(rescueCheck:IonCheckbox)
{
  console.log(this.signupForm)
  if(this.signupForm.valid){

    if(rescueCheck.checked &&  this.RescueCityAdded.length === 0  )
      {
            this.toastCntrl.presentToast("Please add atleast one city for rescue.","dark",1500,"bottom");
            return;
      }
      console.log("signing up!")
      this.signUpNow(rescueCheck);
      
  }else{
    this.toastCntrl.presentToast("Required fields are empty or incorrect. Please fill them in.","dark",1500,"bottom");
   }
}

async signUpNow(rescueCheck: IonCheckbox) {
  const loader = await this.loadingScreen.CreateLoader(
    'Signing Up...',
    'circular',
    undefined,
    'loading-transparent-bg'
  );
  await loader.present();

  const Params = {
    email: this.signupForm.value.email,
    fname: this.signupForm.value.fname,
    lname: this.signupForm.value.lname,
    password: this.signupForm.value.password,
    phone: this.signupForm.value.phone,
  };

  try {
    const response = await this.authService.postData(Params, 'signup');

    console.log('Raw Backend Response:', response);

    // Parse response safely
    let resp: any;
    try {
      resp = typeof response === 'string' ? JSON.parse(response) : response;
    } catch (err) {
      console.error('Error parsing response:', err);
      throw new Error('Invalid response format from server.');
    }

    console.log('Parsed Backend Response:', resp);

    // Check if userData exists to infer success
    if (resp.userData && resp.userData.customer_id) {
      console.log('Signup Successful:', resp);

      // Save user data locally
      localStorage.setItem('userData', JSON.stringify(resp.userData));

      // Handle Rescue City addition if applicable
      if (rescueCheck.checked && this.RescueCityAdded.length > 0) {
        const cityResponse = await this.authService.postData(
          { c_id: resp.userData.customer_id, city: this.RescueCityAdded },
          'AddCitiesRescued'
        );
        console.log('Rescue City Response:', cityResponse);
      }

      // Navigate to home page
      this.navCtrl.navigateRoot('/home');
      return;
    }

    // Handle cases where the response doesn't indicate success
    const errorMessage = this.getErrorMessage(
      resp.errorField,
      resp.message || 'Email or Phone already exists, Try Again...'
    );
    this.toastCntrl.presentToast(errorMessage, 'dark', 1500, 'bottom');
  } catch (err) {
    console.error('Error in signUpNow:', err);

    this.toastCntrl.presentToast(
      'Oops! Failed to create your account. Please try again later.',
      'dark',
      1500,
      'bottom'
    );
  } finally {
    loader.dismiss();
  }
}

/**
 * Generate an appropriate error message based on the field and backend message.
 */
private getErrorMessage(errorField: string, backendMessage: string): string {
  switch (errorField) {
    case 'email':
      return backendMessage || 'Email is already taken. Try another.';
    case 'phone':
      return backendMessage || 'Phone number is already in use. Try another.';
    default:
      return backendMessage || 'An error occurred. Please try again.';
  }
}


// numberStatechanges(field:IonInput)
// {
//   const number = field.value && (field.value as string).trim()
//   if(number)
//     {
//       if(number == this.previousVerifiedPhone)
//         {
//           this.Verified=true;
//         }else{
//           this.Verified=false;
//         }
//     }
// }

async verifyMobile()
{
  const pageType:pageOtpType="signup"
  const modal = await this.modalCntrl.create({
    component: SendOtpPage,
    componentProps:{pageType:pageType},
    id:"send-otp"
  });
 await modal.present();
  const { data, role } = await modal.onWillDismiss();
    
  if (role === 'confirm') {
    console.log(data);
    this.previousVerifiedPhone =data;
    this.Verified=true;
  }
}

async addRescueCity()
{
  
  const pageType:pageAddRescueCityType="signup"
  const modal = await this.modalCntrl.create({
    component: RescueCityComponent,
    componentProps:{
      cities:this.RescueCityAdded,
      ptype:pageType
    }
  });
 await modal.present();
  const { data, role } = await modal.onWillDismiss();
    
  if (role === 'confirm') {
    console.log(data);
    this.RescueCityAdded = data;
    // this.RescueAddedText=data.length>1 ? `${data[0].city} and ${data.length - 1 } cities added.` : `${data[0].city} has been added.`
    this.RescueAddedText = data.length > 2 ? `${data[0].city} and ${data.length - 1} more cities added` 
    : (data.length === 2 ?
     `${data[0].city} and ${data.length - 1} more city added` : `${data[0].city} has been added`);

  }
}
inputshow()
{
console.log(this.signupForm);

}

async presentConfirmationAlert(checkBox:IonCheckbox)
{
  let  buttonOptions = [
    {
      text: 'confirm',
      cssClass:'button-color-danger button-text-capitalize',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
        this.resetRescueCity(checkBox);
        // this.removeItem_fromWishlist(product);
      },
    }, {
      text: 'cancel',
      role: 'cancel',
      cssClass:'button-text-capitalize',
      handler: () => {
        console.log('Alert canceled');
        // this.removeItem_fromWishlist(product);
      checkBox.checked=true;
      },
    },
   
  ];
  const alert =await this.alertCntrl.create("Are you sure ?",buttonOptions,"you will not be able to receive pet rescue notifications.",undefined,"custom-alert-1");
  await alert.present();
}
checkIfUserRescue(checkBox:IonCheckbox)
{
const rescueChecked :boolean=checkBox.checked;
if(!rescueChecked)
  {
    this.presentConfirmationAlert(checkBox);
  }
}

    resetRescueCity(checkBox:IonCheckbox)
    {
      this.RescueCityAdded =[];
      this.RescueAddedText ="";
      checkBox.checked=false;
    }
    
}

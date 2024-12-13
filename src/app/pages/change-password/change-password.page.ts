import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput, ModalController, NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces/User';
import { changePasswordType } from 'src/app/interfaces/changePasswordFlag';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { MatchFields } from 'src/app/validators/matchingField';
// import { SendOtpPage } from '../phoneVerification/send-otp/send-otp.page';
// import { pageOtpType } from 'src/app/interfaces/pageType';
import { NavigationExtras } from '@angular/router';
import { VerifyOtpPage } from '../phoneVerification/verify-otp/verify-otp.page';
import { ToastService } from 'src/app/services/common/toast.service';
interface ResultData {
  email: string;
  firstname: string;
  img: string;
  lastname: string;
  telephone: string;
}
interface ViewUser {
  email: string;
  name: string;
  img: string;
  telephone: string;
}


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  Loading:boolean =true;
  USER :User
  FLAG: string;
  imgUrl:string;
  UserData: ViewUser={
    email: "",
    name: "",
    img: "",
    telephone: ""
  };
  chngePasswordForm = new FormGroup(
    {
      currentPassword:new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(30)]),
      newPassword:new FormControl('',[Validators.required,Validators.minLength(8),Validators.maxLength(30)]),
      confirmPassword:new FormControl('',[Validators.required])
    },MatchFields('confirmPassword','newPassword')
  );
  constructor(
    private authService : AuthServiceService
    ,private navCntrl : NavController
    ,private toastCtrl: ToastService
    ,private modalCntrl : ModalController
  ) {
    this.USER = JSON.parse(localStorage.getItem('userData')!);
    this.FLAG = changePasswordType.changePassword;
    this.imgUrl =this.authService.img();
    
   }
get oldPass():FormControl
{
  return this.chngePasswordForm.controls['currentPassword']
}
get Cpass():FormControl
{
  return this.chngePasswordForm.controls['confirmPassword']
}
get NewPass():FormControl
{
  return this.chngePasswordForm.controls['newPassword']
}



  ngOnInit() {

    this.getUserInfo();
  }

async forgotPassword()
{
  const phoneNumber =  this.UserData.telephone ; 

const validatedNumber = this.validateIndianPhoneNumber(phoneNumber);

  console.log(validatedNumber)

  const modal = await this.modalCntrl.create({
    component: VerifyOtpPage,
    componentProps:{mobile:validatedNumber},
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
        c_id:this.USER.userData.customer_id
      }
    }
    this.navCntrl.pop().finally(()=>{
      this.navCntrl.navigateForward('new-password',params)
    })
    
  }
}

validateIndianPhoneNumber(phoneNumber:string) {
  // Remove any non-numeric characters from the input
  const numericPhoneNumber = phoneNumber.replace(/\D/g, '');

  // Check if the number starts with '0' or '91', which is common in Indian numbers
  if (numericPhoneNumber.startsWith('0')&& numericPhoneNumber.length === 11) {
      // If the number starts with '0', it's likely a local number with STD code
      // Remove the leading '0' and add the country code '+91'
      const formattedNumber = '+91' + numericPhoneNumber.substring(1);

      // Check if the formatted number is a valid Indian phone number
      const regex = /^[+][9][1]\d{10}$/;
      if (regex.test(formattedNumber)) {
          return formattedNumber;
      } else {
          console.error('Invalid Indian phone number:', formattedNumber);
          return null;
      }
  } else if (numericPhoneNumber.startsWith('91') && numericPhoneNumber.length === 12) {
      // If the number starts with '91' and has 12 digits, assume it's already formatted correctly
      return '+' + numericPhoneNumber;
  } else if (numericPhoneNumber.length === 10) {
      // If the number doesn't start with '0' or '91', assume it's a 10-digit Indian phone number
      // Add the country code (+91) and return
      return '+91' + numericPhoneNumber;
  } else {
      // If the number doesn't match any of the expected formats, consider it invalid
      console.error('Invalid Indian phone number:', phoneNumber);
      return null;
  }
}



  checkFlag()
  {
    let flag = changePasswordType;
    if(flag.changePassword == this.FLAG)
    {
      
    }
  }
  getUserInfo()
  {
    this.Loading =true;
    let param = {
      c_id : this.USER.userData.customer_id
    }
    this.authService.postData(param,'customerData').then((result:any)=>{
      if(result.customerData)
      {
        let user :ResultData =result.customerData
         this.UserData.email = user.email;
         this.UserData.name =`${user.firstname} ${user.lastname}` ;
         this.UserData.img = this.imgUrl + user.img;
         this.UserData.telephone = user.telephone;

      }
    }).catch((error: any)=>{console.error(error);}).finally(()=>{
      this.Loading=false; 
    })
  }
  submit(form : FormGroup)
  {
    if(this.chngePasswordForm.status == 'VALID')
    {
      this.chngePasswordForm.disable();
      this.checkCurrentPassword();
      // this.chngePasswordForm.controls.currentPassword.setErrors({incorrectPassword:true});

  }
}
checkCurrentPassword()
{
  let param ={c_id: this.USER.userData.customer_id, password: this.chngePasswordForm.controls.currentPassword.value, email: ''}
  this.authService.postData(param,'passwordCheck').then((result:any)=>{
    console.log(result);
    if(result.passwordCheck == 'passed')
    {
      this.chngePassword()
    }else{
      this.chngePasswordForm.enable();
        this.chngePasswordForm.controls.currentPassword.setErrors({incorrectPassword:true});
      }
      
    }).catch((error: any)=>{
      this.chngePasswordForm.enable();
      console.error(error);
      
    }).finally(()=>{})
  }
  chngePassword()
  {
    let param ={
          password : this.chngePasswordForm.controls.newPassword.value,
          c_id:this.USER.userData.customer_id
        }
    this.authService.postData(param , 'changePassword').then((result:any)=>{
      if(result.changePassword == 'success')
      {
        this.chngePasswordForm.reset();
        // this.goBack(); // go back to prev page 
    this.toastCtrl.presentToast("Password changed successfully","dark",3000,"bottom")

      }
      // else{

      // }
    }).catch((error: any)=>{
      console.error(error);
    }).finally(()=>{
      this.chngePasswordForm.enable();
    })
  }
  // toggle password visibility
  shwPassword(field:IonInput)
  {
    if(field.type==='password')
    {
      field.type='text';
    }else{
      field.type='password';
    }

  }
  onInputChange(data:IonInput) { 
    return (data.value as string)?.replace(/\s/g, '');
  }
resetForm()
{
  this.chngePasswordForm.reset();
}
// goBack(){
// this.navCntrl.pop();
// }
}

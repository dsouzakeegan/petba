import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckboxCustomEvent, IonInput, NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces/User';
import { changePasswordType } from 'src/app/interfaces/changePasswordFlag';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ToastService } from 'src/app/services/common/toast.service';
import { MatchFields } from 'src/app/validators/matchingField';
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
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss','../change-password/change-password.page.scss'],
})
export class NewPasswordPage implements OnInit  {
  Loading:boolean =true;
  // USER :User
  User_id!:string;
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
      // currentPassword:new FormControl('',[Validators.required]),
      newPassword:new FormControl('',[Validators.required,Validators.minLength(8),Validators.maxLength(30)]),
      confirmPassword:new FormControl('',[Validators.required])
    },MatchFields('confirmPassword','newPassword')
  );
  constructor(
    private authService : AuthServiceService
    ,private navCntrl : NavController
    ,private toastCtrl: ToastService
    ,private router: Router
  ) {
    // this.USER = JSON.parse(localStorage.getItem('userData')!);
        const data = this.router.getCurrentNavigation()?.extras.state!;
        if(data['c_id']) this.User_id=data['c_id'];

    this.FLAG = changePasswordType.forgotPassword;
    this.imgUrl =this.authService.img();
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



  checkFlag()
  {
    let flag = changePasswordType;
    if(flag.forgotPassword == this.FLAG)
    {
      
    }
  }
  getUserInfo()
  {
    this.Loading =true;
    let param = {
      // c_id : this.USER.userData.customer_id
      c_id : this.User_id
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
    }).catch((error)=>{console.error(error);}).finally(()=>{
      this.Loading=false; 
    })
  }
  submit(form : FormGroup)
  {
    if(this.chngePasswordForm.status == 'VALID')
    {
      this.chngePasswordForm.disable();
      this.chngePassword();
      // this.chngePasswordForm.controls.currentPassword.setErrors({incorrectPassword:true});

  }
}
// checkCurrentPassword()
// {
//   let param ={c_id: this.USER.userData.customer_id, password: this.chngePasswordForm.controls.currentPassword.value, email: ''}
//   this.authService.postData(param,'passwordCheck').then((result:any)=>{
//     console.log(result);
//     if(result.passwordCheck == 'passed')
//     {
//       this.chngePassword()
//     }else{
//       this.chngePasswordForm.enable();
//         this.chngePasswordForm.controls.currentPassword.setErrors({incorrectPassword:true});
//       }
      
//     }).catch((error)=>{
//       this.chngePasswordForm.enable();
//       console.error(error);
      
//     }).finally(()=>{})
//   }
  chngePassword()
  {
    let param ={
          password : this.chngePasswordForm.controls.newPassword.value,
          c_id:this.User_id
          // c_id:this.USER.userData.customer_id
        }
    this.authService.postData(param , 'changePassword').then((result:any)=>{
      if(result.changePassword == 'success')
      {
        this.chngePasswordForm.reset();
        this.toastCtrl.presentToast("Password changed successfully","dark",3000,"bottom")
        this.goBack(); // go back to prev page 

      }
      // else{

      // }
    }).catch((error)=>{
      console.error(error);
    }).finally(()=>{
      this.chngePasswordForm.enable();
    })
  }
  // toggle password visibility
  shwPassword(e:Event, field:IonInput)
  {
    let checked = (e as CheckboxCustomEvent).target.checked;
    console.log(checked)
    if(checked === true )
    {
      field.type='text';
    }else{
      field.type='password';
    }

  }
resetForm()
{
  this.chngePasswordForm.reset();
}
goBack(){
this.navCntrl.pop();
}
}

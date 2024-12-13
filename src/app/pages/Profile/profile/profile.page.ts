import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { RescueCityComponent } from 'src/app/components/city/rescue-city/rescue-city.component';
import { pageAddRescueCityType } from 'src/app/interfaces/pageType';
import { User } from 'src/app/interfaces/User';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileEdit=false;
  phoneNumber:string='+918390934762';
  readonly phoneMask: MaskitoOptions = {
    mask: [/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/],
    
  };
  RescueLoaded:boolean=false;
  isImageModalOpen=false;
  UserId = ""
  ImagePrefix:string='';
  ImagePreview:string="";
  DefaultImage="https://avatars.pfptown.com/558/anime-boy-pfp-2053.png";

  readonly maskPredicate: MaskitoElementPredicate = (el: HTMLElement) => {
    return (el as HTMLIonInputElement).getInputElement();
  };

  defaultUser={
    firstname:"",
    lastname:"",
    email:"",
    profilePic:"",
    phone:"",
    c_id:""
  };
  userEditbale={
    firstname:"",
    lastname:"",
    email:"",
    profilePic:"",
    phone:"",
    c_id:""
  };
  RescueAddedText: string="";
  RescueCityAdded:{city_id:string,city:string}[] =[];

  constructor(
    private Camera: CameraService,
    private authService : AuthServiceService,
    private loadingScreen: LoadingScreenService,
    private modalCntrl: ModalController,
  ) {
    this.ImagePrefix=this.authService.img();
    this.UserId = JSON.parse(localStorage.getItem('userData')!).userData.customer_id;
   }


   ngOnInit() {
    if(this.UserId)
    {
      this.getUserData();
      this.getRescuedcities();

    }
  }

  editProfile(state:boolean)
  {
    this.profileEdit=state;
  }
  async getUserData()
  {
    let param = {
      c_id:this.UserId
    }
   await this.authService.postData(param,'customerData').then((res:any)=>{
    let customerData =res.customerData;
    this.userEditbale.firstname =  customerData.firstname &&customerData.firstname
    this.defaultUser.firstname =  customerData.firstname &&customerData.firstname

    this.userEditbale.lastname = customerData.lastname && customerData.lastname
    this.defaultUser.lastname = customerData.lastname && customerData.lastname

    this.userEditbale.email = customerData.email &&  customerData.email;
    this.defaultUser.email = customerData.email &&  customerData.email;

    this.userEditbale.profilePic = customerData.img && this.ImagePrefix + customerData.img;
    this.defaultUser.profilePic = customerData.img &&  this.ImagePrefix + customerData.img;

    this.userEditbale.phone = customerData.telephone &&customerData.telephone;
    this.defaultUser.phone = customerData.telephone &&customerData.telephone;

    console.log(this.userEditbale)
  }).catch((error)=>{console.error(error);}).finally(()=>{});
}
getRescuedcities()
 { this.RescueLoaded =false;
  let param = {
    c_id:this.UserId
  }
  this.authService.postData(param,'getRescuedCities').then((res:any)=>{
    console.log("Cities length: ", res.cities.length)
    if(res.cities.length > 0)
      {
      this.RescueCityAdded = res.cities;
      this.RescueAddedText = res.cities.length > 2 ? `${res.cities[0].city} and ${res.cities.length - 1} more cities added` 
      : (res.cities.length === 2 ?
       `${res.cities[0].city} and ${res.cities.length - 1} more city added` : `${res.cities[0].city} has been added`);
    }
  }).catch((error)=>{
    console.error("Something went wrong while fetching rescue cities : ", error)
  }).finally(()=>{
    this.RescueLoaded =true;
  })
  
 }
async setUserNewData()
  {
    this.loadingScreen.presentLoading("Updating",'dots',undefined,"loading-transparent-bg");
    let param ={
      firstname:this.userEditbale.firstname,
      lastname:this.userEditbale.lastname,
      email:this.userEditbale.email,
      telephone:this.userEditbale.phone
      ,c_id:this.UserId
    };
   await this.authService.postData(param,'updateProfile').then((res:any)=>{

    const userToken :User=JSON.parse(localStorage.getItem("userData")!).userData.token;
    let userData= {userData:{
      customer_id:param.c_id,
      email:param.email,
      firstname:param.firstname,
      lastname:param.lastname,
      token:userToken
    }
  }
  this.defaultUser.firstname=this.userEditbale.firstname,
  this.defaultUser.lastname=this.userEditbale.lastname,
  this.defaultUser.email=this.userEditbale.email,
  this.defaultUser.phone=this.userEditbale.phone,
    localStorage.removeItem('userData');
    localStorage.setItem(
      "userData", 
      JSON.stringify(userData)
    );
   }).catch((error)=>{console.error(error);}).finally(()=>{
    this.loadingScreen.dismissLoading();
    this.editProfile(false);
   });
  }

  cancel(form:NgForm)
  {
    this.editProfile(false) ;
    if(form.pristine == false)
    {
      this.userEditbale.firstname = this.defaultUser.firstname;
      this.userEditbale.lastname =  this.defaultUser.lastname ;
      this.userEditbale.phone =  this.defaultUser.phone ;
      this.userEditbale.email = this.defaultUser.email ;
      // this.userEditbale.profilePic = this.defaultUser.profilePic ;
    }
  }
  async changeProfilePic()
  {
    let {image,status}  =await this.Camera.addNewToGallery();
    if(status ==200)
    {
    
      this.setOpen(true);
      this.ImagePreview=image;
      // this.userEditbale.profilePic=image;
    }
  }
  setOpen(state:boolean)
  {
 this.isImageModalOpen=state;
  }
  updateProfilePic()
  {
    this.loadingScreen.presentLoading("",'dots',undefined,"loading-transparent-bg");
    let param = {
      c_id:this.UserId,
      img:this.ImagePreview
    }
    this.authService.postData(param, "updateProfilePic").then((result :any ) =>{
        this.userEditbale.profilePic=this.ImagePrefix+result.Image;
        this.defaultUser.profilePic=this.ImagePrefix+result.Image;
    }).catch((err) =>{
    console.error(err);
    }).finally(()=>{
      this.setOpen(false);
      this.loadingScreen.dismissLoading();
    }); 
  }
  update(form:NgForm)
  {
    console.log(form);
    if(form.valid && !form.pristine){
      console.log('form is valid')
      this.setUserNewData();
    }

  }
  onInputChange(data:string) { 
    return data.replace(/\s/g, '');
  }

  async addRescueCity()
{
  
  const pageType:pageAddRescueCityType="edit"
  const modal = await this.modalCntrl.create({
    component: RescueCityComponent,
    componentProps:{
      cities:this.RescueCityAdded,
      ptype:pageType
    }
  });
 await modal.present();
  const { data, role } = await modal.onWillDismiss();
    
  // if (role === 'confirm') {
    // console.log(data);
    // this.RescueCityAdded = data;
    // this.RescueAddedText = data.length > 2 ? `${data[0].city} and ${data.length - 1} more cities added` 
    // : (data.length === 2 ?
    //  `${data[0].city} and ${data.length - 1} more city added` : `${data[0].city} has been added`);
  // }
  this.getRescuedcities();
}
}

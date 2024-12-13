import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Position } from '@capacitor/geolocation';
import {  IonToggle, ModalController, NavParams } from '@ionic/angular';
import { SelectCityComponent } from 'src/app/components/city/select-city/select-city.component';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';

export interface addForm{
  [key: string]: any; 
  name:string;
  gender: string;
  c_id: string;
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  img5: string;
  img6: string;
  note: string;
  anti_rbs: string;
  viral: string;
  city: string;
  longitude: number;
  latitude: number;
  animal_typ: string;
  city_id: string;
  dob: string;
  breed: string;
  color: string;
  breedName: string;
  address: string;
  animalTypeName: string;
  adopt_id: string;
  petFlag: string;
}
interface PetDetails {
  adopt_id: string;
  animalTypeName: string;
  animal_typ: string;
  anti_rbs: string;
  breed: string;
  breedName: string;
  c_id: string;
  city: string;
  color: string;
  colorid: string;
  date_added: string;
  dob: string;
  gender: string;
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  img5: string;
  img6: string;
  name: string;
  note: string;
  petFlag: string;
  viral: string;
}


export class pageType {
  public static adoption = 1
  public static Pet = 2
}
@Component({
  selector: 'app-edit-mypet',
  templateUrl: './edit-mypet.page.html',
  styleUrls: ['./edit-mypet.page.scss','../Add/pet/pet.page.scss'],
})
export class EditMypetPage implements OnInit {
  images: {
    img: string;
    id: number;
  }[] = []
img="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Pet-rebbit-on-Swing_%28seat%29-in-beijing.jpg/330px-Pet-rebbit-on-Swing_%28seat%29-in-beijing.jpg"
  colors:{id:string,color:string}[]=[];
  breed:{id:string,name:string,animal_id:string}[]=[];
  animal:{name:string,animal_id:string}[]=[];
  pet:addForm={
  c_id:'',
  city_id:'',
  name:"",
  animal_typ:'',
  animalTypeName:"",
  gender:'',
  color:'',
  breed:'',
  breedName:'',
  note:'',
  dob:"",
  adopt_id:'',
  viral:'',
  anti_rbs:'',
  longitude:74.1240,
  latitude:15.2993,
  city:'',
  petFlag:'',
  address:'',img1:'',img2:'',img3:'',img4:'',img5:'',img6:'',};
 Type:any;
 pet_id:string;
  TITLE: string="Edit Pet";
  imageUrl:string;
  isPreviewOpen: boolean = false;
  previewImage: string[]=[];
  constructor(
    private authService : AuthServiceService,
    public modalCtrl : ModalController,
    private geoLocation: GeolocationService,
    private Camera: CameraService,
    private loadingScreen: LoadingScreenService,
    private navparams: NavParams,
    private alertCntrl: AlertServiceService,


  ) {
    this.pet.c_id = JSON.parse(localStorage.getItem('userData')!).userData.customer_id;
    this.Type = this.navparams.get('type');
    this.pet_id = this.navparams.get('pet_id');
    this.imageUrl=this.authService.img();
    if(this.Type == pageType.adoption)
    {
          this.TITLE="Edit Adoption Pet";
        }else if(this.Type == pageType.Pet)
        {
      this.TITLE="Edit Pet";

    }
   }
  // customCounterFormatter(inputLength: number, maxLength: number) {
  //   return `${maxLength - inputLength} characters remaining`;
  // }
  ngOnInit() {
    this.getAnimalOptions();
    this.getColorOptions();
    this.getPetDetails();

  }
  setPreviewState(isOpen: boolean,image:string=''){
    if(isOpen === false)
      {
        this.previewImage=[]
      }else{
        this.previewImage=[image]
      }
    this.isPreviewOpen=isOpen
  }
//   async addImgee()
//   {
//     // if images added are less than 6 
//     if(this.images.length < 6){
//       // add images

//       // this.images.push(this.img)
//       let {image,status}  =await this.Camera.addNewToGallery();
// if(status ==200)
// {

//   // this.images.push(image);
//   this.updatePetImage(image,this.images.length+1)
// }
      
//     }
//   }
  async addImg() {
    const imageLimit = 6;
    // if images added are less than 6 
    if (this.images.length < imageLimit) {
      // add images
      let image_id = 0;
      for (let i = 1; i <= imageLimit; i++) {
        const IdExists = this.images.some(ele => i === ele.id)
        if (!IdExists) {
          console.warn(i)
          image_id = i;
          break;
        }
      }
      if (image_id > 0 && image_id < imageLimit) {

        // this.images.push(this.img)
        let { image, status } = await this.Camera.addNewToGallery();
        if (status == 200) {

          this.updatePetImage(image, image_id)

          // this.images.push(image);
        }

      }
    }
  }

  removeImg(index: number) {
    // this.images.splice(index,1);
    if (this.images.length > 1) {
      let buttonOptions = [

        {
          text: 'confirm',
          cssClass: 'button-color-primary button-text-capitalize',
          role: 'confirm',
          handler: () => {
            console.log('Alert confirmed');
            this.updateRemovepetadoptionImage(index);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'button-color-danger button-text-capitalize',
          handler: () => {
            console.log('Alert canceled');
          },
        },
      ];

      this.alertCntrl.present("Confirmation", buttonOptions, "Are you sure you want to remove this image?", "", "custom-alert-1");
    } else {
      const buttonOptions = [

        {
          text: 'Ok',
          cssClass: 'button-color-primary button-text-capitalize',
          role: 'confirm',
          handler: () => {
            console.log("OK pressed");
          },
        }
      ];
      this.alertCntrl.present("Notice!", buttonOptions, "<small>Can't remove last image. Must have at least one image remaining.</small>", "", "custom-alert-1");

      // console.error("need at least more than one image to delete  ")
    }
  }
  async updateRemovepetadoptionImage(Index :number){
    const  buttonOptions = [
          
      {
        text: 'Ok',
        cssClass:'button-color-primary button-text-capitalize',
        role: 'confirm',
        handler: () => {
          console.log('OK pressed');
        },
      }
    ];
  
   
    const loader = await this.loadingScreen.CreateLoader("Removing image...","circular",undefined,"loading-transparent-bg");
  
    await loader.present();
     const param={imgNumber: this.images[Index].id,adopt_id:this.pet_id}
    this.authService.postData(param, "updateRemovepetadoptionImage").then((result) =>{
    this.images.splice(Index,1);

    this.alertCntrl.present("Completed",buttonOptions,"Image has been removed..","","custom-alert-1");
  
    }).catch(async(err) =>{
      console.error(err);
      await this.alertCntrl.present("Failed",buttonOptions,"Image could not be removed..","","custom-alert-1");
  
    }).finally(()=>{
      loader.dismiss();
  
    });
   }
  get Today()
  {
    let today = new Date();
    today.setHours(23,59,59,0);
    let result = today.toISOString().slice(0, 19)
    // console.log(result)
    return result;

  }
  get LastDay()
  {
// Get today's date
let today = new Date();

// Number of years to go back
let yearsBack =30;

// Set the date back by the specified number of years
today.setFullYear(today.getFullYear() - yearsBack);

// Set hours, minutes, and seconds to 00:00:00
today.setHours(0, 0, 0, 0); 

// Format the date
let Lastday = today.toISOString().slice(0, 19);

// this.DateDummy =Lastday;
// console.log(Lastday);
    return Lastday;
  }
  getSubmitColor(form:NgForm)
  {
    if(form.valid)
    {
      if(form.valid && this.images.length > 0)
      {
        return 'success'
      }
      else{

        return 'danger'
      }
    }else{
      return 'primary'
    }
  }
  getColorOptions()
  {
    let param = {
      id:""
    }
    // this.authService.postData(param,'color').then((res:any)=>{}).catch((error)=>{console.error(error);}).finally(()=>{});
    this.authService.postData(param,'color').then((res:any)=>{
      this.colors = res.color;
    }).catch((error)=>{console.error(error);}).finally(()=>{});
  }
  getAnimalOptions()
  {
    let param = {
      id:""
    }
    this.authService.postData(param,'animalbreed').then((res:any)=>{
      this.animal=res.animalbreed;
    }).catch((error)=>{console.error(error);}).finally(()=>{});
  }
  getBreedOptions(value:string)
  {
    this.breed=[];// empty first 
    
 let animal_id =value;
if (animal_id == '0')
{
  this.breed.push({id:'0',name:'other',animal_id:'0'});
}else{
  let param = {
      id:animal_id
    }
  this.authService.postData(param,'breed').then((res:any)=>{
    this.breed = res.breed;
    this.breed.push({id:'0',name:'other',animal_id:'0'});
  }).catch((error)=>{console.error(error);}).finally(()=>{});
  }
}
async selectCity()
{
  const modal = await this.modalCtrl.create({
    component: SelectCityComponent,
  });
  modal.present();
  // Get Location Latitude And Longitude
  const {location , status} = await this.geoLocation.getCurrentLocation();
  if (status === 200) {
    this.pet.latitude=(location as Position).coords.latitude;
    this.pet.longitude=(location as Position).coords.longitude; 
  }
  //Get City_id And City
  const { data, role } = await modal.onWillDismiss();
  if (role === 'confirm') {
    this.pet.city=data.city;
    this.pet.city_id=data.city_id;
  }
}
addPet(form:NgForm,anti_rbs:IonToggle,viral:IonToggle)
{
  for (let i = 1; i <= 6; i++) {
    const imgKey = "img" + i;
    if (i <= this.images.length) {
      this.pet[imgKey] = this.images[i - 1];
    }else {
      this.pet[imgKey] = ""; // Set to empty string if image doesn't exist
    }
  }
  if (this.images.length > 0)
  {
    if(form.valid && this.pet.img1)
    {
      if(!anti_rbs.checked) this.pet.anti_rbs="";
      if(!viral.checked) this.pet.viral="";
      console.log("Submit form...")
      console.log(form);
      this.updatePet();
      // if(this.Type == pageType.adoption)
      // {
      //   // this.submitPetForAdoption(form);
      // }else if(this.Type == pageType.Pet)
      // {
      //   // this.submitPet(form);
      // }
      
    }else{

      console.log("Form is INvalid")
    }
  }else{
    console.error("please add images...");
  }
  // console.log(form)
}

async updatePetImage(img:string,imgNum :number){
  const  buttonOptions = [
        
    {
      text: 'Ok',
      cssClass:'button-color-primary button-text-capitalize',
      role: 'confirm',
      handler: () => {
        console.log('OK pressed');
      },
    }
  ];

 
  const loader = await this.loadingScreen.CreateLoader("Uploading image...","circular",undefined,"loading-transparent-bg");

  await loader.present();
   const param={img:img,imgNumber:imgNum,adopt_id:this.pet_id}
  //  console.log(imgNum,'Update Image Called',this.pet.adopt_id);
  this.authService.postData(param, "updatepetadoptionImage").then((result) =>{
    this.images.push({ img, id: imgNum });
  this.alertCntrl.present("Completed",buttonOptions,"Image has been uploaded..","","custom-alert-1");

  }).catch(async(err) =>{
    console.error(err);
    await this.alertCntrl.present("Failed",buttonOptions,"Image could not be updated..","","custom-alert-1");

    // this.presentAlert("Upload Failed");
  }).finally(()=>{
    loader.dismiss();

  });
 }
  // UPDATE PET 
async updatePet() {
  
   this.loadingScreen.presentLoading("updating...",'circular',undefined,"loading-transparent-bg");

  console.log(this.pet)
  await this.authService.postData(this.pet, "updatepetadoption").then((result :any) =>{
    
    if(result.updateadopt){        
        console.log(result.adopt);
        // form.resetForm();
        this.pageDismiss('confirm');
        console.log("success");
      }
    }).catch((err) =>{
      console.error(err);

    }).finally(()=>{
      this.loadingScreen.dismissLoading();
    });  
  }
  // SUBMIT PET 
// async submitPet(form:NgForm) {
  
//    this.loadingScreen.presentLoading("",'dots',undefined,"loading-transparent-bg");

//   console.log(this.pet)
//   await this.authService.postData(this.pet, "addpet").then((result :any) =>{
    
//     if(result.adopt){
        
//         // console.log(JSON.stringify(result.adopt));
        
//         console.log(result.adopt);
//         form.resetForm();
//         this.pageDismiss();
//         console.log("success");
//       }
//     }).catch((err) =>{
//       console.error(err);

//     }).finally(()=>{
//       this.loadingScreen.dismissLoading();
//     });  
//   }

  // SUBMIT PET FOR ADOPTION
// async submitPetForAdoption(form:NgForm) {
  
//    this.loadingScreen.presentLoading("",'dots',undefined,"loading-transparent-bg");

//   console.log(this.pet)
//   await this.authService.postData(this.pet, "addpetadoption").then((result :any) =>{
    
//     if(result.adopt){
        
//         // console.log(JSON.stringify(result.adopt));
        
//         console.log(result.adopt);
//         form.resetForm();
//         this.resetImages();
//         this.pageDismiss();
//         console.log("success");
//       }
//     }).catch((err) =>{
//       console.error(err);

//     }).finally(()=>{
//       this.loadingScreen.dismissLoading();
//     });  
//   }
  resetImages()
  {
    this.images = [];
    for (let i = 1; i <= 6; i++) {
      const imgKey  = `img${i}` as keyof addForm;
        (this.pet as { [key: string]: any })[imgKey] = ""; // Set to empty string if image doesn't exist
      
    }
  }

  pageDismiss(role:string='cancel'){
    this.modalCtrl.dismiss("",role);
  }

  getPetDetails()  {
    const params={petID: this.pet_id}
    this.authService.postData(params, "showPetDetails").then((result:any) =>{
      let Pet :PetDetails=result.showPetDetails;

      this.pet.adopt_id    = Pet.adopt_id;
      this.pet.animalTypeName     = Pet.animalTypeName;
      this.pet.animal_typ     = Pet.animal_typ;
      if(this.pet.animal_typ) this.getBreedOptions(this.pet.animal_typ);
      this.pet.anti_rbs     = Pet.anti_rbs;
      this.pet.breed     = Pet.breed;
      this.pet.breedName     = Pet.breedName;
      this.pet.c_id     = Pet.c_id;
      this.pet.city     = Pet.city;
      this.pet.color     = Pet.colorid;
      // this.pet.colorName     = Pet.color;
      // this.pet.date_added     = Pet.date_added;
      this.pet.dob     = Pet.dob;
      this.pet.gender     = Pet.gender;
      // this.pet.img1     = Pet.img1;
      // this.pet.img2     = Pet.img2;
      // this.pet.img3     = Pet.img3;
      // this.pet.img4     = Pet.img4;
      // this.pet.img5     = Pet.img5;
      // this.pet.img6     = Pet.img6;
      this.pet.name     = Pet.name;
      this.pet.note     = Pet.note;
      this.pet.petFlag     = Pet.petFlag;
      this.pet.viral     = Pet.viral;
      if(Pet.img1!=""){this.images.push({img:this.imageUrl+Pet.img1,id :1});};
      if(Pet.img2!=""){this.images.push({img:this.imageUrl+Pet.img2,id :2});};
      if(Pet.img3!=""){this.images.push({img:this.imageUrl+Pet.img3,id :3});};
      if(Pet.img4!=""){this.images.push({img:this.imageUrl+Pet.img4,id :4});};
      if(Pet.img5!=""){this.images.push({img:this.imageUrl+Pet.img5,id :5});};
      if(Pet.img6!=""){this.images.push({img:this.imageUrl+Pet.img6,id :6});};

    },(err) =>{
      console.error(err);
      // this.loadingScreen.dismiss();
    });
  }

}

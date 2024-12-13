import { Component, OnInit } from '@angular/core';
import { SegmentChangeEventDetail, SegmentValue, IonSegmentCustomEvent } from '@ionic/core';
import { ActionSheetController, ModalController, PopoverController, RefresherCustomEvent } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { PetPage } from '../Add/pet/pet.page';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { ToastService } from 'src/app/services/common/toast.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';
export interface Adopt {
  adopt_id: string;
  animalName: string;
  animalTypeName: string;
  breed: string;
  breedName: string;
  c_id: string;
  city: string;
  dob: string;
  gender: string;
  img1: string;
  name: string;
}
export interface AdoptDet {
  dob: string;
  c_id: string;
  adopt_id: string;
  img: string;
  name: string;
  breed: string;
  city: string;
  animalName: string;
}


@Component({
  selector: 'app-my-pets',
  templateUrl: './my-pets.page.html',
  styleUrls: ['./my-pets.page.scss'],
})
export class MyPetsPage implements OnInit {
  tabSelected: SegmentValue | undefined = "pets";
  imgUrl: string;
  isLoading: boolean = true;
  adopt: AdoptDet[] = [];
  pet: AdoptDet[] = [];
  // noMoreData: boolean=false;
  UserId: string;

  constructor(
    private authService: AuthServiceService,
    private toastCntrl: ToastService,
    private loadingCtrl: LoadingScreenService,
    private modalCtrl: ModalController,
    private alertCntrl: AlertServiceService,
  ) {
    this.imgUrl = this.authService.img();
    this.UserId = JSON.parse(localStorage.getItem('userData')!).userData.customer_id;
  }

  ngOnInit() { }
  ionViewWillEnter() {
    this.myAdoption();
    this.myPets();
  }
  tabChanged($event: IonSegmentCustomEvent<SegmentChangeEventDetail>) {
    this.tabSelected = $event.target.value;

    // this.checkTabSelected();
  }
  checkTabSelected() {
    if (this.tabSelected === 'pets') {
      this.myPets();
    } else if (this.tabSelected === 'adoption') {
      this.myAdoption();
    }
  }
  removeAlert(pet_id:string) {
    let  buttonOptions = [
     
      {
        text: 'Remove Pet',
        cssClass:'button-color-danger button-text-capitalize',
        role: 'confirm',
        handler: () => {
          console.log('Alert confirmed');
        //remove pet fuction  
        this.removePet(pet_id);
        },
      },
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass:'button-text-capitalize',
        handler: () => {
          console.log('Alert canceled');
        },
      },
    ];
    this.alertCntrl.present("Remove Pet",buttonOptions,"your pet will no longer be listed. Are you sure?","","custom-alert-1");
  }
 async removePet(pet_id:string) {
    const params:{
      adopt_id: string;
      c_id: string;
  } ={
    adopt_id:pet_id,
c_id:this.UserId
  }
  const loader = await this.loadingCtrl.CreateLoader("Removing Pet...","circular",undefined,"loading-transparent-bg");
 await loader.present();
    this.authService.postData(params,"deleteMyPet").then((res:any)=>{
      if(res.DeletePet.adopt_id){
    this.toastCntrl.presentToast("Pet removed","custom-light",5000,"bottom");
      
        this.checkTabSelected();
      }else{
          
    this.toastCntrl.presentToast("Pet could not be removed","custom-light",5000,"bottom");

        }
    }).catch((error)=>{
      this.toastCntrl.presentToast("Something went wrong...","custom-light",5000,"bottom");
    }).finally(async ()=>{
      await loader.dismiss();
    })
  }
  myPets() {
    console.log("Pets fetching");
    this.pet = [];
    this.isLoading = true;
    this.authService.postData({ c_id: this.UserId }, "listpet").then(
      (result: any) => {
        let petData = result.listpet;
        if (petData.length > 0) {
          this.pet = this.getDataInFormat(petData);
          console.log("successfull", this.adopt);
        } else {

          console.log("Data is Null");

        }
      }

    ).catch((err) => {
      console.error(err);

    }).finally(() => {
      this.isLoading = false;

    });
  }
  myAdoption() {
    console.log("Adoption fetching");
    this.adopt = [];
    this.isLoading = true;
    this.authService.postData({ c_id: this.UserId }, "listMyadoption").then(
      (result: any) => {
        let petData = result.listMyadoption;
        if (petData.length > 0) {
          this.adopt = this.getDataInFormat(petData);
          console.log("successfull", this.adopt);
        } else {

          console.log("Data is Null");

        }
      }

    ).catch((err) => {
      console.error(err);

    }).finally(() => {
      this.isLoading = false;

    });
  }

  getDataInFormat(Pets: Adopt[]): AdoptDet[] {
    var pp = [];
    for (let ado of Pets) {
      let adopt_id = ado.adopt_id;
      let c_id = ado.c_id;
      let img1 = ado.img1;
      let name = ado.name;
      let breed = ado.breed;
      let city = ado.city;
      let dob = ado.dob;
      let animalName = ado.animalName;
      let proado = {
        dob: dob,
        c_id: c_id,
        adopt_id: adopt_id,
        img: this.imgUrl + img1,
        name: name,
        breed: breed,
        city: city,
        animalName: animalName,

      };
      pp.push(proado);
    }
    return pp;
  }
  Refresh(event: RefresherCustomEvent) {
    this.checkTabSelected();
    setTimeout(() => {
      event.target.complete();
    }, 3000);
  }
  async openPetForm(type: number) {
    const modal = await this.modalCtrl.create({
      component: PetPage, componentProps: { type: type }
    });
    modal.present();

  }
}

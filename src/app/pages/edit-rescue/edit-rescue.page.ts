import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Position } from '@capacitor/geolocation';
import {
  IonContent,
  ModalController,
  NavParams,
  SelectCustomEvent,
} from '@ionic/angular';
import { SelectCityComponent } from 'src/app/components/city/select-city/select-city.component';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';

export interface addForm {
  status: string;
  c_id: string;
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  img5: string;
  img6: string;
  city: string;
  condition_id: string;
  gender: string;
  animalType: string;
  conditionLevel: string;
  latitude: string | number;
  longitude: string | number;
  city_id: string;
  address: string;
  description: string;
  id: string;
}
interface rescuePet {
  c_id: string;
  id: string;
  customer_id: string;
  condition_id: string;
  conditionLevel_id: string;
  animal_id: string;
  gender: string;
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  img5: string;
  img6: string;
  city: string;
  city_id: string;
  address: string;
  latitude: string;
  longitude: string;
  description: string;
  status: string;
  date_time: string;
  name: string;
}
export class pageType {
  public static adoption = 1;
  public static Pet = 2;
}
@Component({
  selector: 'app-edit-rescue',
  templateUrl: './edit-rescue.page.html',
  styleUrls: ['./edit-rescue.page.scss', '../Add/pet/pet.page.scss'],
})
export class EditRescuePage implements OnInit {
  images: {
    img: string;
    id: number;
  }[] = [];
  // img="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Pet-rebbit-on-Swing_%28seat%29-in-beijing.jpg/330px-Pet-rebbit-on-Swing_%28seat%29-in-beijing.jpg"
  gender: { id: string; name: string }[] = [
    { id: '1', name: 'Male' },
    { id: '2', name: 'Female' },
  ];
  conditions: { id: string; name: string }[] = [];
  conditionLevel: { id: string; name: string }[] = [
    { id: '1', name: 'Low ( Needs Home )' },
    { id: '2', name: 'Medium ( Medical Assistance )' },
    { id: '3', name: 'High ( Critical )' },
  ];
  animal: { name: string; animal_id: string }[] = [];
  pet: addForm = {
    gender: '',
    id: '',
    city: '',
    address: '',
    latitude: 15.2993,
    longitude: 74.124,
    description: '',
    status: '',
    condition_id: '',
    conditionLevel: '',
    c_id: '',
    img1: '',
    img2: '',
    img3: '',
    img4: '',
    img5: '',
    img6: '',
    animalType: '',
    city_id: '',
  };
  TITLE: string = 'Edit Rescue Pet';
  rescue_id: string;
  imgUrl: string;
  Loading: boolean = false;
  isPreviewOpen: boolean = false;
  previewImage: string[]=[];
  constructor(
    private authService: AuthServiceService,
    private modalCtrl: ModalController,
    private Camera: CameraService,
    private loadingScreen: LoadingScreenService,
    private alertCntrl: AlertServiceService,
    private geoLocation: GeolocationService,
    private navparams: NavParams
  ) {
    this.pet.c_id = JSON.parse(
      localStorage.getItem('userData')!
    ).userData.customer_id;
    this.rescue_id = this.navparams.get('rescue_id');
    this.pet.id = this.navparams.get('rescue_id');
    this.imgUrl = this.authService.img();
  }

  ngOnInit() {
    this.getOptions();
    this.getRescuePetDetails();
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

      this.alertCntrl.present(
        'Confirmation',
        buttonOptions,
        'Are you sure you want to remove this image?',
        '',
        'custom-alert-1'
      );
    } else {
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
      this.alertCntrl.present(
        'Notice!',
        buttonOptions,
        "<small>Can't remove last image. Must have at least one image remaining.</small>",
        '',
        'custom-alert-1'
      );

      // console.error("need at least more than one image to delete  ")
    }
  }
  async updateRemovepetadoptionImage(Index: number) {
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

    const loader = await this.loadingScreen.CreateLoader(
      'Removing image...',
      'circular',
      undefined,
      'loading-transparent-bg'
    );

    await loader.present();
    const param = {
      imgNumber: this.images[Index].id,
      rescue_id: this.rescue_id,
    };
    this.authService
      .postData(param, 'updateRemoveRescuePetImage')
      .then((result) => {
        this.images.splice(Index, 1);

        this.alertCntrl.present(
          'Completed',
          buttonOptions,
          'Image has been removed..',
          '',
          'custom-alert-1'
        );
      })
      .catch(async (err) => {
        console.error(err);
        await this.alertCntrl.present(
          'Failed',
          buttonOptions,
          'Image could not be removed..',
          '',
          'custom-alert-1'
        );
      })
      .finally(() => {
        loader.dismiss();
      });
  }
  getSubmitColor(form: NgForm) {
    if (!form.pristine) {
      if (form.valid && this.images.length > 0) {
        return 'success';
      } else {
        return 'danger';
      }
    } else {
      return 'primary';
    }
  }

  getOptions() {
    let param = {};
    this.authService
      .postData(param, 'addRescueFields')
      .then((res: any) => {
        this.animal = res.animal_type;
        this.conditions = res.condition;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {});
  }
  async getCurrentLocation() {
    // Get Location Latitude And Longitude
    const { location, status } = await this.geoLocation.getCurrentLocation();
    if (status === 200) {
      this.pet.latitude = (location as Position).coords.latitude;
      this.pet.longitude = (location as Position).coords.longitude;
    }
  }
  async selectCity() {
    this.getCurrentLocation();
    const modal = await this.modalCtrl.create({
      component: SelectCityComponent,
    });
    modal.present();

    //Get City_id And City
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.pet.city = data.city;
      this.pet.city_id = data.city_id;
    }
  }
  resetImages() {
    this.images = [];
    for (let i = 1; i <= 6; i++) {
      const imgKey = `img${i}` as keyof addForm;
      (this.pet as { [key: string]: any })[imgKey] = ''; // Set to empty string if image doesn't exist
    }
  }
  addPet(form: NgForm, content: IonContent) {
    // for (let i = 1; i <= 6; i++) {
    //   const imgKey  = `img${i}` as keyof addForm;
    //   if (i <= this.images.length ) {
    //     (this.pet as { [key: string]: any })[imgKey] = this.images[i - 1];
    //   }else {
    //     (this.pet as { [key: string]: any })[imgKey] = ""; // Set to empty string if image doesn't exist
    //   }
    // }
    if (this.images.length > 0) {
      if (form.valid) {
        this.submitPet(form);
      } else {
        console.log('Form is invalid');
      }
    } else {
      console.error('please add images...');
      content.scrollToTop(250);
    }
  }
  async submitPet(form: NgForm) {
    if (!form.pristine) {
      this.loadingScreen.presentLoading(
        'updating...',
        'circular',
        undefined,
        'loading-transparent-bg'
      );
      console.log(this.pet);
      await this.authService
        .postData(this.pet, 'editRescuePet')
        .then((result: any) => {
          if (result.editRescuePet) {
            console.log(result.editRescuePet);
            // form.resetForm();
            this.pageDismiss('confirm');
            console.log('success');
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.loadingScreen.dismissLoading();
        });
    } else {
      this.pageDismiss('confirm');
    }
  }

  // getPostion(coords:{lat:number,lng:number}){
  //   this.pet.latitude=coords.lat;
  //   this.pet.longitude=coords.lng;

  //   console.error(this.pet)
  // }

  pageDismiss(role: string = 'cancel') {
    this.modalCtrl.dismiss('', role);
  }
  getRescuePetDetails() {
    this.rescue_id = this.navparams.get('rescue_id');
    const rescuePetParams: { id: string } = { id: this.rescue_id };
    this.authService
      .postData(rescuePetParams, 'showRescuePet')
      .then((result: any) => {
        if (result.showRescuePet) {
          let resp: rescuePet = result.showRescuePet;
          // this.rescuePet.img1=resp.img1;
          // this.rescuePet.img2=resp.img2;
          // this.rescuePet.img3=resp.img3;
          // this.rescuePet.img4=resp.img4;
          // this.rescuePet.img5=resp.img5;
          // this.rescuePet.img6=resp.img6;
          this.pet.c_id = resp.customer_id;
          this.pet.description = resp.description;
          this.pet.address = resp.address;
          this.pet.animalType = resp.animal_id;
          this.pet.gender = resp.gender;
          this.pet.condition_id = resp.condition_id;
          this.pet.conditionLevel = resp.conditionLevel_id;

          this.pet.city = resp.city;
          this.pet.latitude = resp.latitude;
          this.pet.longitude = resp.longitude;
          this.pet.status = resp.status;
          if (resp.img1 != '') {
            let a = { img: this.imgUrl + resp.img1, id: 1 };
            this.pet.img1 = a.img;
            this.images.push(a);
          }
          if (resp.img2 != '') {
            let a = { img: this.imgUrl + resp.img2, id: 2 };
            this.pet.img2 = a.img;
            this.images.push(a);
          }
          if (resp.img3 != '') {
            let a = { img: this.imgUrl + resp.img3, id: 3 };
            this.pet.img3 = a.img;
            this.images.push(a);
          }
          if (resp.img4 != '') {
            let a = { img: this.imgUrl + resp.img4, id: 4 };
            this.pet.img4 = a.img;
            this.images.push(a);
          }
          if (resp.img5 != '') {
            let a = { img: this.imgUrl + resp.img5, id: 5 };
            this.pet.img5 = a.img;
            this.images.push(a);
          }
          if (resp.img6 != '') {
            let a = { img: this.imgUrl + resp.img6, id: 6 };
            this.pet.img6 = a.img;
            this.images.push(a);
          }
        } else {
          this.Loading = false;
          console.error('pet not found :(');
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.Loading = false;
      });
  }

  async addImg() {
    const imageLimit = 6;
    // if images added are less than 6
    if (this.images.length < imageLimit) {
      // add images
      let image_id = 0;
      for (let i = 1; i <= imageLimit; i++) {
        const IdExists = this.images.some((ele) => i === ele.id);
        if (!IdExists) {
          console.warn(i);
          image_id = i;
          break;
        }
      }
      if (image_id > 0 && image_id < imageLimit) {
        // this.images.push(this.img)
        let { image, status } = await this.Camera.addNewToGallery();
        if (status == 200) {
          this.updatePetImage(image, image_id);

          // this.images.push(image);
        }
      }
    }
  }
  async updatePetImage(img: string, imgNum: number) {
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

    const loader = await this.loadingScreen.CreateLoader(
      'Uploading image...',
      'circular',
      undefined,
      'loading-transparent-bg'
    );

    await loader.present();

    const param = { img: img, imgNumber: imgNum, id: this.rescue_id };
    //  console.log(imgNum,'Update Image Called',this.pet.adopt_id);
    this.authService
      .postData(param, 'updateRescueImage')
      .then((result) => {
        this.images.push({ img, id: imgNum });
        this.alertCntrl.present(
          'Completed',
          buttonOptions,
          'Image has been uploaded..',
          '',
          'custom-alert-1'
        );
      })
      .catch(async (err) => {
        console.error(err);
        await this.alertCntrl.present(
          'Failed',
          buttonOptions,
          'Image could not be updated..',
          '',
          'custom-alert-1'
        );

        // this.presentAlert("Upload Failed");
      })
      .finally(() => {
        loader.dismiss();
      });
  }
}

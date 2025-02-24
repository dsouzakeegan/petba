import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Position } from '@capacitor/geolocation';
import { ModalController, NavParams, SelectCustomEvent } from '@ionic/angular';
import { SelectCityComponent } from 'src/app/components/city/select-city/select-city.component';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';

export interface addForm {
  name: string;
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
  long: number;
  lat: number;
  animal: string;
  city_id: string;
  dob: string;
  breed: string;
  color: string;
  breedName: string;
  address: string;
  animalName: string;
}
export class pageType {
  public static adoption = 1;
  public static Pet = 2;
}
@Component({
  selector: 'app-pet',
  templateUrl: './pet.page.html',
  styleUrls: ['./pet.page.scss'],
})
export class PetPage implements OnInit {
  images: string[] = [];
  img =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Pet-rebbit-on-Swing_%28seat%29-in-beijing.jpg/330px-Pet-rebbit-on-Swing_%28seat%29-in-beijing.jpg';
  colors: { id: string; color: string }[] = [];
  breed: { id: string; name: string; animal_id: string }[] = [];
  animal: { name: string; animal_id: string }[] = [];
  pet: addForm | any = {
    dob: '',
    name: '',
    gender: '',
    color: '',
    address: '',
    c_id: '',
    img1: '',
    img2: '',
    img3: '',
    img4: '',
    img5: '',
    img6: '',
    animalName: '',
    note: '',
    anti_rbs: '',
    viral: '',
    city: '',
    long: 74.124,
    lat: 15.2993,
    animal: '',
    city_id: '',
    breed: '',
    breedName: '',
  };
  Type: any;
  TITLE: string = 'Add Pet';
  isPreviewOpen: boolean = false;
  previewImage: string[] = [];
  constructor(
    private authService: AuthServiceService,
    public modalCtrl: ModalController,
    private geoLocation: GeolocationService,
    private Camera: CameraService,
    private loadingScreen: LoadingScreenService,
    private navparams: NavParams
  ) // private authServicew: ,
  {
    this.pet.c_id = JSON.parse(
      localStorage.getItem('userData')!
    ).userData.customer_id;
    this.Type = this.navparams.get('type');
    if (this.Type == pageType.adoption) {
      this.TITLE = 'Add Adoption Pet';
    } else if (this.Type == pageType.Pet) {
      this.TITLE = 'Add Pet';
    }
  }
  // customCounterFormatter(inputLength: number, maxLength: number) {
  //   return `${maxLength - inputLength} characters remaining`;
  // }
  ngOnInit() {
    this.getAnimalOptions();
    this.getColorOptions();
  }
  setPreviewState(isOpen: boolean, image: string = '') {
    if (isOpen === false) {
      this.previewImage = [];
    } else {
      this.previewImage = [image];
    }
    this.isPreviewOpen = isOpen;
  }
  async addImg() {
    // if images added are less than 6
    if (this.images.length < 6) {
      // add images

      // this.images.push(this.img)
      let { image, status } = await this.Camera.addNewToGallery();
      if (status == 200) {
        this.images.push(image);
      }
    }
  }
  removeImg(index: number) {
    this.images.splice(index, 1);
  }
  get Today() {
    let today = new Date();
    today.setHours(23, 59, 59, 0);
    let result = today.toISOString().slice(0, 19);
    // console.log(result)
    return result;
  }
  get LastDay() {
    // Get today's date
    let today = new Date();

    // Number of years to go back
    let yearsBack = 30;

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
  getColorOptions() {
    let param = {
      id: '',
    };
    // this.authService.postData(param,'color').then((res:any)=>{}).catch((error)=>{console.error(error);}).finally(()=>{});
    this.authService
      .postData(param, 'color')
      .then((res: any) => {
        this.colors = res.color;
        
        console.log('animal list',  this.colors);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {});
  }

  getAnimalOptions() {
    let param = {
      id: '',
    };
    this.authService
      .postData(param, 'animalbreed')
      .then((res: any) => {
        this.animal = res.animalbreed;
        console.log('animal list',  this.animal);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {});
  }

  getBreedOptions(e: Event) {
    
      let param = {
        id: '',
      };
      this.authService
        .postData(param, 'breed')
        .then((res: any) => {

          console.log('animal list', res.breed);
          this.breed = res.breed;
          console.log('animal list', this.breed);
          //this.breed.push({ id: '0', name: 'other', animal_id: '0' });
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {});
  }


  async selectCity() {
    const modal = await this.modalCtrl.create({
      component: SelectCityComponent,
    });
    modal.present();
    // Get Location Latitude And Longitude
    const { location, status } = await this.geoLocation.getCurrentLocation();
    if (status === 200) {
      this.pet.lat = (location as Position).coords.latitude;
      this.pet.long = (location as Position).coords.longitude;
    }
    //Get City_id And City
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.pet.city = data.city;
      this.pet.city_id = data.city_id;
    }
  }
  addPet(form: NgForm) {
    for (let i = 1; i <= 6; i++) {
      const imgKey = 'img' + i;
      if (i <= this.images.length) {
        this.pet[imgKey] = this.images[i - 1];
      } else {
        this.pet[imgKey] = ''; // Set to empty string if image doesn't exist
      }
    }
    if (this.images.length > 0) {
      if (form.valid && this.pet.img1) {
        console.log('Submit form...');
        if (this.Type == pageType.adoption) {
          this.submitPetForAdoption(form);
        } else if (this.Type == pageType.Pet) {
          this.submitPet(form);
        }
      } else {
        console.log('Form is INvalid');
      }
    } else {
      console.error('please add images...');
    }
    // console.log(form)
  }
  async submitPet(form: NgForm) {
    this.loadingScreen.presentLoading(
      '',
      'dots',
      undefined,
      'loading-transparent-bg'
    );

    console.log(this.pet);
    await this.authService
      .postData(this.pet, 'addpet')
      .then((result: any) => {
        if (result.adopt) {
          // console.log(JSON.stringify(result.adopt));

          console.log(result.adopt);
          form.resetForm();
          this.pageDismiss();
          console.log('success');
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.loadingScreen.dismissLoading();
      });
  }
  async submitPetForAdoption(form: NgForm) {
    this.loadingScreen.presentLoading(
      '',
      'dots',
      undefined,
      'loading-transparent-bg'
    );

    console.log(this.pet);
    await this.authService
      .postData(this.pet, 'addpetadoption')
      .then((result: any) => {
        if (result.adopt) {
          // console.log(JSON.stringify(result.adopt));

          console.log(result.adopt);
          form.resetForm();
          this.resetImages();
          this.pageDismiss();
          console.log('success');
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.loadingScreen.dismissLoading();
      });
  }
  resetImages() {
    this.images = [];
    for (let i = 1; i <= 6; i++) {
      const imgKey = `img${i}` as keyof addForm;
      (this.pet as { [key: string]: any })[imgKey] = ''; // Set to empty string if image doesn't exist
    }
  }

  pageDismiss() {
    this.modalCtrl.dismiss();
  }
}

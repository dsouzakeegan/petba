import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Position } from '@capacitor/geolocation';
import { IonContent, ModalController } from '@ionic/angular';
import { SelectCityComponent } from 'src/app/components/city/select-city/select-city.component';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';
import { NavController } from '@ionic/angular';


export interface addForm {
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
  latitude: number;
  longitude: number;
  city_id: string;
  address: string;
  description: string;
}

export class pageType {
  public static adoption = 1;
  public static Pet = 2;
}

@Component({
  selector: 'app-rescuepet',
  templateUrl: './rescuepet.page.html',
  styleUrls: ['./rescuepet.page.scss', '../pet/pet.page.scss'],
})
export class RescuepetPage implements OnInit {
  images: string[] = [];
  img = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Pet-rebbit-on-Swing_%28seat%29-in-beijing.jpg/330px-Pet-rebbit-on-Swing_%28seat%29-in-beijing.jpg";

  gender: { id: string; name: string }[] = [
    { id: '1', name: "Male" },
    { id: '2', name: "Female" },
  ];
  conditions: { id: string; name: string }[] = [];
  conditionLevel: { id: string; name: string }[] = [
    { id: '1', name: "Low ( Needs Home )" },
    { id: '2', name: "Medium ( Medical Assistance )" },
    { id: '3', name: "High ( Critical )" },
  ];
  animal: { name: string; animal_id: string }[] = [];
  pet: addForm = { gender: '', condition_id: '', conditionLevel: '', address: '', c_id: '', img1: '', img2: '', img3: '', img4: '', img5: '', img6: '', description: '', city: '', longitude: 74.1240, latitude: 15.2993, animalType: '', city_id: '' };

  TITLE: string = "Rescue Pet";
  isPreviewOpen: boolean = false;
  previewImage: string[] = [];

  constructor(
    private authService: AuthServiceService,
    private modalCtrl: ModalController,
    private Camera: CameraService,
    private loadingScreen: LoadingScreenService,
    private geoLocation: GeolocationService,
    private navCtrl: NavController
  ) {
    this.pet.c_id = JSON.parse(localStorage.getItem('userData')!).userData.customer_id;
  }

  setPreviewState(isOpen: boolean, image: string = '') {
    if (isOpen === false) {
      this.previewImage = [];
    } else {
      this.previewImage = [image];
    }
    this.isPreviewOpen = isOpen;
  }

  ngOnInit() {
    this.getOptions();
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
    this.authService.postData(param, 'addRescueFields').then((res: any) => {
      this.animal = res.animal_type;
      this.conditions = res.condition;
    }).catch((error) => { console.error(error); }).finally(() => { });
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

    // Get City_id And City
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
      (this.pet as { [key: string]: any })[imgKey] = ""; // Set to empty string if image doesn't exist
    }
  }

  addPet(form: NgForm, content: IonContent) {
    for (let i = 1; i <= 6; i++) {
      const imgKey = `img${i}` as keyof addForm;
      if (i <= this.images.length) {
        (this.pet as { [key: string]: any })[imgKey] = this.images[i - 1];
      } else {
        (this.pet as { [key: string]: any })[imgKey] = ""; // Set to empty string if image doesn't exist
      }
    }
    if (this.images.length > 0) {
      if (form.valid && this.pet.img1) {
        // console.log("Submit form...")
        // console.log(this.pet)
        this.submitPet(form);
      } else {
        console.log("Form is invalid");
      }
    } else {
      console.error("please add images...");
      content.scrollToTop(250);
    }
    // console.log(this.pet)
    // console.log(form)
  }

  async submitPet(form: NgForm) {
    this.loadingScreen.presentLoading("", 'dots', undefined, "loading-transparent-bg");

    console.log(this.pet);
    await this.authService.postData(this.pet, "addRescuePet").then((result: any) => {
      if (result.addRescuePet) {
        let fcmParam = {
          city: this.pet.city,
          city_id: this.pet.city_id,
          c_id: this.pet.c_id,
          rescue_id: result.addRescuePet.id
        }
        this.authService.postData(fcmParam, "sendRescueFCM");
        console.log(result.addRescuePet);
        form.resetForm();
        this.resetImages();
        this.pageDismiss();
        console.log("success");
      }
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      this.loadingScreen.dismissLoading();
    });
  }

  // getPostion(coords:{lat:number,lng:number}){
  //   this.pet.latitude=coords.lat;
  //   this.pet.longitude=coords.lng;
  //   console.error(this.pet)
  // }

  pageDismiss() {
    this.navCtrl.back();
  }

  // Cancel method to handle the cancel button click event
  cancel() {
    this.pageDismiss();
  }
}

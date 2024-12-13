import { Component, OnInit } from '@angular/core';
import { ActionSheetController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { AdoptionFilterComponent } from 'src/app/components/adoption-filter/adoption-filter.component';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { PetPage } from '../../Add/pet/pet.page';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { Position } from '@capacitor/geolocation';
import { SelectCityComponent } from 'src/app/components/city/select-city/select-city.component';
import { CityService } from 'src/app/services/city/city.service';

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
const defaultSelectCityText = "Select City";

@Component({
  selector: 'app-adoption',
  templateUrl: './adoption.page.html',
  styleUrls: ['./adoption.page.scss'],
})
export class AdoptionPage implements OnInit {
  isLoading: boolean = true;
  SelectedCity = defaultSelectCityText;
  adoptionListParams = {
    lastPet: 0,
    ageSort: "",
    locationSort: "",
    newSort: "",
    animalTypeName: "",
    breed: "",
    color: "",
    gender: "",
    latitude: 15.2993,
    longitude: 74.1240,
    city: "",
    city_id: "",
  };
  adopt: AdoptDet[] = [];
  imageUrl: string;
  noMoreData: boolean = false;

  constructor(
    private authService: AuthServiceService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private geoLocation: GeolocationService,
    private cityService: CityService
  ) {
    // GEOLOCATION
    this.imageUrl = this.authService.img();

    // by default sort
    this.adoptionListParams.locationSort = 'true';
    this.adoptionListParams.ageSort = '';
    this.adoptionListParams.newSort = '';
    this.LocationSort();
  }

  ngOnInit() {
    this.cityService.currentCity.subscribe(city => {
      this.adoptionListParams.city = city.city;
      this.adoptionListParams.city_id = city.city_id;
      this.SelectedCity = city.city;
      this.loadAdoptionList();
    });
  }

  loadAdoptionList() {
    this.adopt = [];
    this.isLoading = true;
    this.noMoreData = false;
    this.adoptionListParams.lastPet = 0;
  
    // Ignore city_id to fetch all adoption listings
    if (this.adoptionListParams.city_id === 'GA30' || this.adoptionListParams.city_id === '') {
      this.adoptionListParams.city_id = '';  // Clear city_id to fetch all cities
      this.adoptionListParams.city = '';  // Optionally clear city for display purposes
    }
  
    this.authService.postData(this.adoptionListParams, "listadoption").then(
      (result: any) => {
        if (result.listadopt.length > 0) {
          this.adoptionListParams.lastPet = result.listadopt.length;
          var pp = [];
          for (let ado of result.listadopt) {
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
              img: this.imageUrl + img1,
              name: name,
              breed: breed,
              city: city,
              animalName: animalName,
            };
            pp.push(proado);
          }
          this.adopt = pp;
        } else {
          this.adopt = [];
          this.noMoreData = true;
        }
      }
    ).catch((err) => {
      console.error(err);
    }).finally(() => {
      this.isLoading = false;
    });
  }
  

  onIonInfinite(ev: Event) {
    this.authService.postData(this.adoptionListParams, "listadoption").then(
      (result: any) => {
        if (result.listadopt.length > 0) {
          this.noMoreData = false;
          var pp = [];
          this.adoptionListParams.lastPet += result.listadopt.length;
          for (let ado of result.listadopt) {
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
              img: this.imageUrl + img1,
              name: name,
              breed: breed,
              city: city,
              animalName: animalName,
            };
            pp.push(proado);
          }
          this.adopt.push(...pp);
        } else {
          this.noMoreData = true;
        }
      }
    ).catch((err) => {
      console.error(err);
    }).finally(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    });
  }

  async LocationSort() {
    // Get Location Latitude And Longitude
    const { location, status } = await this.geoLocation.getCurrentLocation();
    if (status === 200) {
      this.adoptionListParams.latitude = (location as Position).coords.latitude;
      this.adoptionListParams.longitude = (location as Position).coords.longitude;
    }
    this.loadAdoptionList();
  }

  async presentSort() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Sort By',
      cssClass: 'custom-sort-actionSheet',
      buttons: [
        {
          text: 'Location(nearest)',
          role: this.adoptionListParams.locationSort == 'true' ? 'selected' : "",
          handler: () => {
            this.adoptionListParams.locationSort = 'true';
            this.adoptionListParams.ageSort = '';
            this.adoptionListParams.newSort = '';
            this.LocationSort();
          }
        },
        {
          text: 'Most Recent',
          role: this.adoptionListParams.newSort == 'true' ? 'selected' : "",
          handler: () => {
            this.adoptionListParams.newSort = 'true';
            this.adoptionListParams.ageSort = '';
            this.adoptionListParams.locationSort = '';
            this.loadAdoptionList();
          }
        },
        {
          text: 'Most Young',
          role: this.adoptionListParams.ageSort == 'true' ? 'selected' : "",
          handler: () => {
            this.adoptionListParams.ageSort = 'true';
            this.adoptionListParams.locationSort = '';
            this.adoptionListParams.newSort = '';
            this.loadAdoptionList();
          }
        },
      ],
    });

    await actionSheet.present();
  }

  async openFilterPage() {
    const modal = await this.modalCtrl.create({
      component: AdoptionFilterComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.adoptionListParams.animalTypeName = data.animalTypeName;
      this.adoptionListParams.breed = data.breed;
      this.adoptionListParams.color = data.color;
      this.adoptionListParams.gender = data.gender;
      this.loadAdoptionList();
    }
  }

  async openAddForm() {
    const modal = await this.modalCtrl.create({
      component: PetPage, componentProps: { type: 1 }
    });
    modal.present();
  }

  async selectCity() {
    const modal = await this.modalCtrl.create({
      component: SelectCityComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.SelectedCity = data.city;

      // If "Goa" or "All" is selected, clear the city_id to load all adoptions
      if (data.city === 'all' || data.city === 'Goa') {
        this.adoptionListParams.city_id = 'GA30';
        this.adoptionListParams.city = 'Goa';
      } else {
        this.adoptionListParams.city_id = data.city_id;
        this.adoptionListParams.city = data.city;
      }

      this.cityService.changeCity({ city_id: this.adoptionListParams.city_id, city: this.adoptionListParams.city });
      this.loadAdoptionList();
    }
  }
}

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

    console.log('Request Parameters:', this.adoptionListParams); // Debug log
  
    // Clear city_id and city if default "Goa" or "All" is selected
    if (this.adoptionListParams.city_id === 'GA30' || this.adoptionListParams.city_id === '') {
      this.adoptionListParams.city_id = ''; 
      this.adoptionListParams.city = '';
    }
  
    this.authService.postData(this.adoptionListParams, "listadoption").then(
      (result: any) => {
        try {
          console.log('API Raw Response:', result); // Log the raw response
    
          // Add a safe check for result and listadopt
          if (result && result.listadopt && Array.isArray(result.listadopt)) {
            if (result.listadopt.length > 0) {
              this.adoptionListParams.lastPet = result.listadopt.length;
              const processedAdoptions = result.listadopt.map((ado: any) => ({
                dob: ado.dob,
                c_id: ado.c_id,
                adopt_id: ado.adopt_id,
                img: this.imageUrl + ado.img1,
                name: ado.name,
                breed: ado.breed,
                city: ado.city,
                animalName: ado.animalName,
              }));
              this.adopt = processedAdoptions;
            } else {
              this.noMoreData = true; // No data found
            }
          } else {
            throw new Error('Unexpected response format or missing listadopt.');
          }
        } catch (err) {
          console.error('Error processing server response:', err);
          this.adopt = [];
          this.noMoreData = true;
        }
      }
    ).catch((err) => {
      console.error('Error fetching data:', err.message || err);
      alert('Failed to load adoption list. Please try again later.');
    }).finally(() => {
      this.isLoading = false;
    });
    
  }
  
  onIonInfinite(ev: Event) {
    this.authService.postData(this.adoptionListParams, "listadoption").then(
      (result: any) => {
        try {
          console.log('API Raw Response (onInfinite):', result);
          if (result?.listadopt && Array.isArray(result.listadopt)) {
            if (result.listadopt.length > 0) {
              this.noMoreData = false;
              const newAdoptions = result.listadopt.map((ado: any) => ({
                dob: ado.dob,
                c_id: ado.c_id,
                adopt_id: ado.adopt_id,
                img: this.imageUrl + ado.img1,
                name: ado.name,
                breed: ado.breed,
                city: ado.city,
                animalName: ado.animalName,
              }));
              this.adoptionListParams.lastPet += result.listadopt.length;
              this.adopt.push(...newAdoptions);
            } else {
              this.noMoreData = true; // No more data to load
            }
          } else {
            throw new Error('Unexpected response format or missing listadopt.');
          }
        } catch (err) {
          console.error('Error processing server response (onInfinite):', err);
          this.noMoreData = true;
        }
      }
    ).catch((err) => {
      console.error('Error fetching data (onInfinite):', err.message || err);
      alert('Failed to load additional adoption listings. Please try again later.');
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

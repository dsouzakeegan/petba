import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  InfiniteScrollCustomEvent,
  ModalController,
} from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { RescueFilterComponent } from 'src/app/components/rescue-filter/rescue-filter.component';
import { Position } from '@capacitor/geolocation';

export interface FilterOptions {
  city: string[];
  condition: string[];
  animalType: string[];
  gender: string[];
}
export interface Rescue {
  ConditionType: string;
  Distance: string;
  PID: string;
  address: string;
  city: string;
  conditionLevel_id: string;
  description: string;
  id: string;
  img1: string;
  latitude: string;
  longitude: string;
  status: string;
}

@Component({
  selector: 'app-rescues',
  templateUrl: './rescues.page.html',
  styleUrls: ['./rescues.page.scss'],
})
export class RescuesPage implements OnInit {
  noMoreMyRescueListData = false;
  noMoreAllRescueListData = false;
  allRescueParams: {
    c_id: string | null;
    latitude: number | string;
    longitude: number | string;
    lastPet: number;
    filter: string | FilterOptions;
    sort: string;
  };
  myRescueParams: {
    c_id: string | null;
    latitude: number | string;
    longitude: number | string;
    lastPet: number;
    filter: string | FilterOptions;
    sort: string;
  };
  allrescueList: Rescue[] = [];
  myRescueList: Rescue[] = [];
  imgUrl: string;
  tabSelected = '';
  pageTitle = '';
  Loading = true;

  constructor(
    private geoLocation: GeolocationService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private authService: AuthServiceService
  ) {
    this.imgUrl = this.authService.img();

    // Safely retrieve the customer ID
    const id = this.getCustomerId();

    if (!id) {
      console.warn(
        'Customer ID not found. Ensure userData is correctly stored in localStorage.'
      );
    }

    this.allRescueParams = {
      c_id: null,
      latitude: 15.2993,
      longitude: 74.124,
      lastPet: 0,
      filter: '',
      sort: '',
    };
    this.myRescueParams = {
      c_id: id,
      latitude: 15.2993,
      longitude: 74.124,
      lastPet: 0,
      filter: '',
      sort: '',
    };

    this.allRescueParams.sort = '1';
    this.LocationSort();
  }

  ngOnInit() {
    this.tabChange('all');
  }

  /**
   * Safely retrieves the customer ID from localStorage.
   */
  private getCustomerId(): string | null {
    try {
      const userDataRaw = localStorage.getItem('userData');
      if (!userDataRaw) {
        console.warn('userData not found in localStorage.');
        return null;
      }

      const userData = JSON.parse(userDataRaw);
      if (!userData?.userData?.customer_id) {
        console.warn('Customer ID not found in userData.');
        return null;
      }

      return userData.userData.customer_id;
    } catch (error) {
      console.error('Error accessing customer_id:', error);
      return null;
    }
  }

  async getMyRescues() {
    this.Loading = true;
    this.myRescueParams.lastPet = 0;
    await this.authService
      .postData(this.myRescueParams, 'rescueList')
      .then((result: any) => {
        if (result.rescueList.length > 0) {
          this.myRescueList.push(...result.rescueList);
          this.myRescueParams.lastPet += result.rescueList.length;
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.Loading = false;
      });
  }

  async getAllRescues() {
    this.Loading = true;
    this.allrescueList = [];
    this.allRescueParams.lastPet = 0;
    await this.authService
      .postData(this.allRescueParams, 'rescueList')
      .then((result: any) => {
        if (result.rescueList.length > 0) {
          this.allrescueList.push(...result.rescueList);
          this.allRescueParams.lastPet += result.rescueList.length;
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.Loading = false;
      });
  }

  tabChange(a: string) {
    if (a === 'all') {
      if (this.allrescueList.length === 0) {
        this.getAllRescues();
      }
      this.tabSelected = 'all';
      this.pageTitle = 'Rescues';
    } else if (a === 'my') {
      if (this.myRescueList.length === 0) {
        this.getMyRescues();
      }
      this.tabSelected = 'my';
      this.pageTitle = 'My Rescues';
    }
  }

  async onIonInfinite(ev: Event) {
    if (this.tabSelected === 'all') {
      await this.authService
        .postData(this.allRescueParams, 'rescueList')
        .then((result: any) => {
          if (result.rescueList.length > 0) {
            this.allrescueList.push(...result.rescueList);
            this.allRescueParams.lastPet += result.rescueList.length;
          } else {
            this.noMoreAllRescueListData = true;
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          (ev as InfiniteScrollCustomEvent).target.complete();
        });
    }

    if (this.tabSelected === 'my') {
      await this.authService
        .postData(this.myRescueParams, 'rescueList')
        .then((result: any) => {
          if (result.rescueList.length > 0) {
            this.myRescueList.push(...result.rescueList);
            this.myRescueParams.lastPet += result.rescueList.length;
          } else {
            this.noMoreMyRescueListData = true;
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          (ev as InfiniteScrollCustomEvent).target.complete();
        });
    }
  }

  async LocationSort() {
    const { location, status } = await this.geoLocation.getCurrentLocation();
    if (status === 200) {
      this.allRescueParams.latitude = (location as Position).coords.latitude;
      this.allRescueParams.longitude = (location as Position).coords.longitude;
    }
    this.getAllRescues();
  }

  async presentSort() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Sort By',
      cssClass: 'custom-sort-actionSheet',
      buttons: [
        {
          text: 'Location(nearest)',
          role: this.allRescueParams.sort === '1' ? 'selected' : '',
          handler: () => {
            this.allRescueParams.sort = '1';
            this.LocationSort();
          },
        },
        {
          text: 'Most Recent',
          role: this.allRescueParams.sort === '2' ? 'selected' : '',
          handler: () => {
            this.allRescueParams.sort = '2';
            this.getAllRescues();
          },
        },
      ],
    });

    await actionSheet.present();
  }

  async openFilterPage() {
    const modal = await this.modalCtrl.create({
      component: RescueFilterComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.allRescueParams.filter = data;
      this.getAllRescues();
    }
  }
}

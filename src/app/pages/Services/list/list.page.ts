import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  InfiniteScrollCustomEvent,
  ModalController,
} from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { SFilterPage } from '../s-filter/s-filter.page';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { Position } from '@capacitor/geolocation';
export interface listDetail {
  bName: string;
  city: string;
  close_time: string;
  pName: string;
  fee: string;
  id: string;
  img: string;
  latitude: string;
  longitude: string;
  open_time: string;
  phoneNumber: string;
  rating: string;
  gender?: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  noMoreData = false;
  title = 'Services';
  listParams = {
    c_id: '',
    latitude: 15.2993,
    longitude: 74.124,
    city_id: '',
    locationSort: '',
    rateSort: '',
    alphaSort: '',
    filter: '',
    tab: 'a',
    offset: 0,
  };
  Loading: boolean = true;
  list: listDetail[] = [];
  imgPlaceholder =
    '../../../../assets/error/service-fallback.jpg';
  _TYPE: string;
  imgUrl: string;
  constructor(
    private authService: AuthServiceService,
    private geoLocation: GeolocationService,
    private router: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController
  ) {
    this._TYPE = this.router.snapshot.paramMap.get('type')!;
    this.imgUrl = this.authService.img();
  }
  ngOnInit() {
    this.getList();
  }
  getList() {
    this.Loading = true;
    // Vets
    if (this._TYPE == '1') {
      this.title = 'Vets';
      this.getVets();
    }
    // Shelter
    else if (this._TYPE == '2') {
      this.title = 'Shelters';
      this.getShelters();
    }
    // Groomer
    else if (this._TYPE == '3') {
      this.title = 'Groomers';
      this.getGroomer();
    }
    // Trainer
    else if (this._TYPE == '4') {
      this.title = 'Trainers';
      this.getTrainers();
    }
    // Foster
    else if (this._TYPE == '5') {
      this.title = 'Fosters';
      this.getFosters();
    }
  }
  getFosters() {
    console.log('Fosters...');
    this.listParams.offset = 0;
    this.authService
      .postData(this.listParams, 'fosterlist')
      .then((result: any) => {
        if (result.shelterlist.length > 0) {
          this.listParams.offset = result.shelterlist.length;
          const data = [];
          for (let pro of result.shelterlist) {
            let id = pro.id;
            let name = pro.name;
            let img = pro.img1;
            let phoneNumber = pro.phoneNumber;
            let fee = pro.fee;
            // let verified = pro.verified;
            let latitude = pro.latitude;
            let longitude = pro.longitude;
            let rating = pro.rating;
            let open_time = pro.open_time;
            let close_time = pro.close_time;
            let owner = pro.owner;
            let city = pro.city;
            let proc: listDetail = {
              id: id,
              bName: name,
              img: this.imgUrl + img,
              phoneNumber: phoneNumber,
              fee: fee,
              latitude: latitude,
              longitude: longitude,
              rating: rating,
              open_time: open_time,
              close_time: close_time,
              pName: owner,
              city: city,
            };
            data.push(proc);
          }
          this.list = data;
        } else {
          console.log('Fosters empty...');
          this.noMoreData = true;
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.Loading = false;
      });
  }
  getTrainers() {
    console.log('Trainers...');
    this.listParams.offset = 0;
    this.authService
      .postData(this.listParams, 'listtrainer')
      .then((result: any) => {
        if (result.listtrainer.length > 0) {
          this.listParams.offset = result.listtrainer.length;
          const prop = [];
          for (let pro of result.listtrainer) {
            let id = pro.id;
            let name = pro.name;
            let img = pro.img;
            let phoneNumber = pro.phoneNumber;
            let latitude = pro.latitude;
            let longitude = pro.longitude;
            let fee = pro.fee;
            let rating = pro.rating;
            let open_time = pro.open_time;
            let close_time = pro.close_time;
            let gender = pro.gender;
            let trainer = pro.trainer;
            let details = pro.details;
            let city = pro.city;
            let proc: listDetail = {
              id: id,
              bName: name,
              img: this.imgUrl + img,
              phoneNumber: phoneNumber,
              latitude: latitude,
              longitude: longitude,
              fee: fee,
              rating: rating,
              open_time: open_time,
              close_time: close_time,
              gender: gender,
              pName: trainer,
              city: city,
            };
            prop.push(proc);
          }
          this.list = prop;
        } else {
          console.log('Trainers Empty...');
          this.noMoreData = true;
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.Loading = false;
      });
  }
  getGroomer() {
    console.log('Groomers...');
    this.listParams.offset = 0;
    this.authService
      .postData(this.listParams, 'listgrooming')
      .then((result: any) => {
        if (result.listgrooming.length > 0) {
          this.listParams.offset = result.listgrooming.length;
          const prop = [];
          for (let pro of result.listgrooming) {
            let id = pro.id;
            let name = pro.name;
            let img = pro.img;
            let phoneNumber = pro.phoneNumber;
            let latitude = pro.latitude;
            let longitude = pro.longitude;
            let fee = pro.fee;
            let rating = pro.rating;
            let open_time = pro.open_time;
            let close_time = pro.close_time;
            let gender = pro.gender;
            let groomer = pro.groomer;
            let details = pro.details;
            let city = pro.city;
            let proc: listDetail = {
              id: id,
              bName: name,
              img: this.imgUrl + img,
              phoneNumber: phoneNumber,
              latitude: latitude,
              longitude: longitude,
              fee: fee,
              rating: rating,
              open_time: open_time,
              close_time: close_time,
              gender: gender,
              pName: groomer,
              // details: details,
              city: city,
            };
            prop.push(proc);
          }
          this.list = prop;
        } else {
          this.noMoreData = true;
          console.log('Groomers empty...');
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.Loading = false;
      });
  }
  getShelters() {
    console.log('Shelter...');
    this.listParams.offset = 0;
    this.authService
      .postData(this.listParams, 'shelterlist')
      .then((result: any) => {
        if (result.shelterlist.length > 0) {
          this.listParams.offset = result.shelterlist.length;
          const data = [];
          for (let pro of result.shelterlist) {
            let id = pro.id;
            let name = pro.name;
            let img = pro.img1;
            let phoneNumber = pro.phoneNumber;
            let fee = pro.fee;
            // let verified = pro.verified;
            let latitude = pro.latitude;
            let longitude = pro.longitude;
            let rating = pro.rating;
            let open_time = pro.open_time;
            let close_time = pro.close_time;
            let owner = pro.owner;
            let city = pro.city;
            let proc: listDetail = {
              id: id,
              bName: name,
              img: this.imgUrl + img,
              phoneNumber: phoneNumber,
              fee: fee,
              latitude: latitude,
              longitude: longitude,
              rating: rating,
              open_time: open_time,
              close_time: close_time,
              pName: owner,
              city: city,
            };
            data.push(proc);
          }
          this.list = data;
        } else {
          this.noMoreData = true;
          console.log('Shelters empty...');
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.Loading = false;
      });
  }
  getVets() {
    console.log('vets...');
    this.listParams.offset = 0;
    this.authService
      .postData(this.listParams, 'listvets')
      .then((result: any) => {
        if (result.listvets.length > 0) {
          const data = [];
          this.listParams.offset = result.listvets.length;
          for (let pro of result.listvets) {
            let id = pro.id;
            let rating = pro.rating;
            let open_time = pro.open_time;
            let fee = pro.fee;
            let doctor = pro.doctor;
            let clinic = pro.clinic;
            let close_time = pro.close_time;
            let city = pro.city;
            let phoneNumber = pro.phoneNumber;
            let gender = pro.gender;
            let latitude = pro.latitude;
            let longitude = pro.longitude;
            let img = pro.img;
            let proc: listDetail = {
              id: id,
              rating: rating,
              open_time: open_time,
              fee: fee,
              pName: doctor,
              bName: clinic,
              close_time: close_time,
              city: city,
              img: this.imgUrl + img,
              phoneNumber: phoneNumber,
              latitude: latitude,
              longitude: longitude,
              gender: gender,
            };
            data.push(proc);
          }
          this.list = data;
        } else {
          this.noMoreData = true;
          console.log('Vet is Empty..');
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.Loading = false;
      });
  }
  onIonInfinite(ev: Event) {
    //  VETS
    if (this._TYPE == '1') {
      this.authService
        .postData(this.listParams, 'listvets')
        .then((result: any) => {
          if (result.listvets.length > 0) {
            this.listParams.offset += result.listvets.length;
            for (let pro of result.listvets) {
              let id = pro.id;
              let rating = pro.rating;
              let open_time = pro.open_time;
              let fee = pro.fee;
              let doctor = pro.doctor;
              let clinic = pro.clinic;
              let close_time = pro.close_time;
              let city = pro.city;
              let phoneNumber = pro.phoneNumber;
              let gender = pro.gender;
              let latitude = pro.latitude;
              let longitude = pro.longitude;
              let img = pro.img;
              let proc: listDetail = {
                id: id,
                rating: rating,
                open_time: open_time,
                fee: fee,
                pName: doctor,
                bName: clinic,
                close_time: close_time,
                city: city,
                img: this.imgUrl + img,
                phoneNumber: phoneNumber,
                latitude: latitude,
                longitude: longitude,
                gender: gender,
              };
              this.list.push(proc);
            }
          } else {
            this.noMoreData = true;
            console.log('Vet is Empty..');
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          (ev as InfiniteScrollCustomEvent).target.complete();
        });
    }
    // Shelter
    else if (this._TYPE == '2') {
      this.authService
        .postData(this.listParams, 'shelterlist')
        .then((result: any) => {
          if (result.shelterlist.length > 0) {
            this.listParams.offset += result.shelterlist.length;
            for (let pro of result.shelterlist) {
              let id = pro.id;
              let name = pro.name;
              let img = pro.img1;
              let phoneNumber = pro.phoneNumber;
              let fee = pro.fee;
              // let verified = pro.verified;
              let latitude = pro.latitude;
              let longitude = pro.longitude;
              let rating = pro.rating;
              let open_time = pro.open_time;
              let close_time = pro.close_time;
              let owner = pro.owner;
              let city = pro.city;
              let proc: listDetail = {
                id: id,
                bName: name,
                img: this.imgUrl + img,
                phoneNumber: phoneNumber,
                fee: fee,
                latitude: latitude,
                longitude: longitude,
                rating: rating,
                open_time: open_time,
                close_time: close_time,
                pName: owner,
                city: city,
              };
              this.list.push(proc);
            }
          } else {
            this.noMoreData = true;
            console.log('Shelters empty...');
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          (ev as InfiniteScrollCustomEvent).target.complete();
        });
    }
    // Groomer
    else if (this._TYPE == '3') {
      this.authService
        .postData(this.listParams, 'listgrooming')
        .then((result: any) => {
          if (result.listgrooming.length > 0) {
            this.listParams.offset += result.listgrooming.length;
            for (let pro of result.listgrooming) {
              let id = pro.id;
              let name = pro.name;
              let img = pro.img;
              let phoneNumber = pro.phoneNumber;
              let latitude = pro.latitude;
              let longitude = pro.longitude;
              let fee = pro.fee;
              let rating = pro.rating;
              let open_time = pro.open_time;
              let close_time = pro.close_time;
              let gender = pro.gender;
              let groomer = pro.groomer;
              let details = pro.details;
              let city = pro.city;
              let proc: listDetail = {
                id: id,
                bName: name,
                img: this.imgUrl + img,
                phoneNumber: phoneNumber,
                latitude: latitude,
                longitude: longitude,
                fee: fee,
                rating: rating,
                open_time: open_time,
                close_time: close_time,
                gender: gender,
                pName: groomer,
                // details: details,
                city: city,
              };
              this.list.push(proc);
            }
          } else {
            this.noMoreData = true;
            console.log('Groomers empty...');
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          (ev as InfiniteScrollCustomEvent).target.complete();
        });
    }
    // Trainer
    else if (this._TYPE == '4') {
      this.authService
        .postData(this.listParams, 'listtrainer')
        .then((result: any) => {
          if (result.listtrainer.length > 0) {
            this.listParams.offset += result.listtrainer.length;
            for (let pro of result.listtrainer) {
              let id = pro.id;
              let name = pro.name;
              let img = pro.img;
              let phoneNumber = pro.phoneNumber;
              let latitude = pro.latitude;
              let longitude = pro.longitude;
              let fee = pro.fee;
              let rating = pro.rating;
              let open_time = pro.open_time;
              let close_time = pro.close_time;
              let gender = pro.gender;
              let trainer = pro.trainer;
              let details = pro.details;
              let city = pro.city;
              let proc: listDetail = {
                id: id,
                bName: name,
                img: this.imgUrl + img,
                phoneNumber: phoneNumber,
                latitude: latitude,
                longitude: longitude,
                fee: fee,
                rating: rating,
                open_time: open_time,
                close_time: close_time,
                gender: gender,
                pName: trainer,
                city: city,
              };
              this.list.push(proc);
            }
          } else {
            console.log('Trainers Empty...');
            this.noMoreData = true;
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          (ev as InfiniteScrollCustomEvent).target.complete();
        });
    }
    // Foster
    else if (this._TYPE == '5') {
      this.authService
        .postData(this.listParams, 'fosterlist')
        .then((result: any) => {
          if (result.shelterlist.length > 0) {
            this.listParams.offset += result.shelterlist.length;
            for (let pro of result.shelterlist) {
              let id = pro.id;
              let name = pro.name;
              let img = pro.img1;
              let phoneNumber = pro.phoneNumber;
              let fee = pro.fee;
              // let verified = pro.verified;
              let latitude = pro.latitude;
              let longitude = pro.longitude;
              let rating = pro.rating;
              let open_time = pro.open_time;
              let close_time = pro.close_time;
              let owner = pro.owner;
              let city = pro.city;
              let proc: listDetail = {
                id: id,
                bName: name,
                img: this.imgUrl + img,
                phoneNumber: phoneNumber,
                fee: fee,
                latitude: latitude,
                longitude: longitude,
                rating: rating,
                open_time: open_time,
                close_time: close_time,
                pName: owner,
                city: city,
              };
              this.list.push(proc);
            }
          } else {
            console.log('Fosters empty...');
            this.noMoreData = true;
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          (ev as InfiniteScrollCustomEvent).target.complete();
        });
    }
  }
  async LocationSort() {
    // Get Location Latitude And Longitude
    const { location, status } = await this.geoLocation.getCurrentLocation();
    if (status === 200) {
      this.listParams.latitude = (location as Position).coords.latitude;
      this.listParams.longitude = (location as Position).coords.longitude;
    }
    this.getList();
  }
  async presentSort() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Sort By',
      cssClass: 'custom-sort-actionSheet',
      buttons: [
        {
          text: 'Location(nearest)',
          role: this.listParams.locationSort == 'true' ? 'selected' : '',
          handler: () => {
            this.listParams.locationSort = 'true';
            this.listParams.alphaSort = '';
            this.listParams.rateSort = '';
            // this.getList();
            this.LocationSort();
          },
        },
        {
          text: 'Rating',
          role: this.listParams.rateSort == 'true' ? 'selected' : '',
          handler: () => {
            this.listParams.rateSort = 'true';
            this.listParams.alphaSort = '';
            this.listParams.locationSort = '';
            this.getList();
          },
          // data: {
          //   action: 'share',
          // },
        },
        {
          text: 'A - Z',
          role: this.listParams.alphaSort == 'true' ? 'selected' : '',
          handler: () => {
            this.listParams.alphaSort = 'true';
            this.listParams.locationSort = '';
            this.listParams.rateSort = '';
            this.getList();
          },
        },
      ],
    });

    await actionSheet.present();
  }
  async openFilterPage() {
    const modal = await this.modalCtrl.create({
      component: SFilterPage,
      componentProps: { type: this._TYPE },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(data);
      this.listParams.filter = data;
      this.getList();
      // this.adoptionListParams.breed=data.breed;
      // this.adoptionListParams.color=data.color;
      // this.adoptionListParams.gender=data.gender;
      // this.loadAdoptionList();
    }
  }

  getRColor(rating: string, index: number, type: number = 1) {
    let rate: number = Math.floor(parseFloat(rating));
    if (type === 1) {
      switch (rate) {
        case 1:
          return 'danger';
        case 2:
          return 'danger';
        case 3:
          return 'primary';
        case 4:
          return 'success';
        case 5:
          return 'warning';
        default:
          return 'medium';
      }
    } else {
      if (index + 1 > rate) {
        return 'medium';
      }
      switch (rate) {
        case 1:
          return 'danger';
        case 2:
          return 'danger';
        case 3:
          return 'primary';
        case 4:
          return 'success';
        case 5:
          return 'warning';
        default:
          return 'medium';
      }
    }
  }
  goto(url:string)
  {
    console.log(url)
    document.location.href=url;
  }
}

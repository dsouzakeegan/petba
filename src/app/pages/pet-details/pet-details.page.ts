import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';
import { EditMypetPage } from '../edit-mypet/edit-mypet.page';

export interface Pet {
  adopt_id: string;
  animalTypeName: string;
  anti_rbs: string;
  breed: string;
  c_id: string;
  city: string;
  color: string;
  date_added: string;
  dob: string;
  gender: string;
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  img5: string;
  img6: string;
  latitude: string;
  longitude: string;
  name: string;
  note: string;
  petFlag: string;
  telephone: string;
  viral: string;
  owner_name: string;
}

@Component({
  selector: 'app-pet-details',
  templateUrl: './pet-details.page.html',
  styleUrls: ['./pet-details.page.scss'],
})
export class PetDetailsPage implements OnInit {
  img: string[] = [];
  readMore: boolean = false;
  pet: Pet = {
    adopt_id: "",
    animalTypeName: "",
    anti_rbs: "",
    breed: "",
    c_id: "",
    city: "",
    color: "",
    date_added: "",
    dob: "",
    gender: "",
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    img5: "",
    img6: "",
    latitude: "",
    longitude: "",
    name: "",
    note: "",
    petFlag: "",
    telephone: "",
    viral: "",
    owner_name: "",
  };
  isLoading: boolean = true;
  petDetailParams = { owner_id: '', c_id: '', adopt_id: '' };
  imgUrl: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthServiceService,
    private chatService: ChatService,
    private navCtrl: NavController,
    private alertCtrl: AlertServiceService,
    private loadingCtrl: LoadingScreenService,
    private modalCtrl: ModalController,
  ) {
    this.petDetailParams.owner_id = this.route.snapshot.paramMap.get('owner-id')!;
    this.petDetailParams.adopt_id = this.route.snapshot.paramMap.get('pet-id')!;
    this.petDetailParams.c_id = this.getCustomerId();
    this.imgUrl = this.authService.img();
  }

  ngOnInit() {
    this.getPetInfo();
  }

  /**
   * Safely retrieves the customer ID from localStorage.
   */
  private getCustomerId(): string {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || '{}');
      if (userData?.userData?.customer_id) {
        return userData.userData.customer_id;
      } else {
        console.warn('Warning: Customer ID not found in userData.');
        return ''; // Return an empty string as a fallback
      }
    } catch (err) {
      console.error('Error retrieving customer ID:', err);
      return ''; // Return an empty string as a fallback
    }
  }

  getPetInfo() {
    this.isLoading = true;
    this.img = [];
    this.authService.postData(this.petDetailParams, "petadoptiondetails").then(
      (result: any) => {
        if (result.adoptdetails) {
          this.pet = result.adoptdetails;

          if (result.adoptdetails.img1) this.img.push(this.imgUrl + result.adoptdetails.img1);
          if (result.adoptdetails.img2) this.img.push(this.imgUrl + result.adoptdetails.img2);
          if (result.adoptdetails.img3) this.img.push(this.imgUrl + result.adoptdetails.img3);
          if (result.adoptdetails.img4) this.img.push(this.imgUrl + result.adoptdetails.img4);
          if (result.adoptdetails.img5) this.img.push(this.imgUrl + result.adoptdetails.img5);
          if (result.adoptdetails.img6) this.img.push(this.imgUrl + result.adoptdetails.img6);
        }
        if (result.cus) {
          this.pet.owner_name = `${result.cus.firstname} ${result.cus.lastname}`;
        }
      }).catch((err) => {
        console.error('Error fetching pet details:', err);
      }).finally(() => {
        this.isLoading = false;
      });
  }

  async startChat(item: Pet) {
    try {
      await this.loadingCtrl.presentLoading("", 'circular', undefined, "loading-transparent-bg");
  
      // Navigate to the chat page with the necessary parameters
      this.navCtrl.navigateForward(['/chat', this.petDetailParams.c_id, this.petDetailParams.owner_id, item.adopt_id]);
  
      await this.loadingCtrl.dismissLoading();
    } catch (e) {
      await this.loadingCtrl.dismissLoading();
      console.error('Error starting chat:', e);
      this.alertCtrl.present('Error', [
        {
          text: 'OK',
          role: 'cancel'
        }
      ], 'Failed to start chat. Please try again.');
    }
  }

  async addPetFor() {
    let msg: string = this.pet.petFlag == '1' ? "Adding pet..." : "Removing pet...";
    const loader = await this.loadingCtrl.CreateLoader(msg, "circular", undefined, "loading-transparent-bg");
    await loader.present();

    let params = {
      petFlag: this.pet.petFlag == '1' ? '2' : '1',
      petId: this.pet.adopt_id
    };

    this.authService.postData(params, "addForAdoption").then((result) => {
      console.log('Pet status updated:', result);
    }).catch((err) => {
      console.log('Error updating pet status:', err);
    }).finally(async () => {
      await loader.dismiss();
      this.navCtrl.back();
    });
  }

  presentConfirmationAlert() {
    let buttonOptions = [
      {
        text: 'Confirm',
        cssClass: 'button-color-primary button-text-capitalize',
        role: 'confirm',
        handler: () => {
          this.addPetFor();
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

    let msg = this.pet.petFlag == '1' ? "Do you want to add your pet for adoption?" : "Do you want to remove your pet from adoption?";
    this.alertCtrl.present("Confirm", buttonOptions, msg, "Are you sure?", "custom-alert-1");
  }

  async editPet() {
    const type = this.pet.petFlag == '1' ? 2 : 1;
    this.openModal(type);
  }

  async openModal(type: number) {
    const modal = await this.modalCtrl.create({
      component: EditMypetPage,
      componentProps: { type: type, pet_id: this.pet.adopt_id }
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role == 'confirm') {
      this.getPetInfo();
    }
  }
}
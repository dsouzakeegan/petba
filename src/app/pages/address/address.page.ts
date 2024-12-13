import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
  isCardOpen: boolean = false;
  products: any;
  AddressList: any[] = [];
  isLoading: boolean = false;
  selectedCardIndex: number = -1;
  addressID: number | null = null; // Initialize addressID as null
  newAddress: any = {
    first_name: '',
    last_name: '',
    address: '',
    landmark: '',
    locality: '',
    phone: '',
    pincode: '',
    email: '',
    city: '',
    state: '',
    token: '',
    customer_id: '',
    adrs_id: ''
  };
  param: any;
  productSummary: string = '';
  productSummaryTransfer: any;

  constructor(
    private authService: AuthServiceService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.param = JSON.parse(localStorage.getItem("userData")!);
    console.log('User Data---------------------> : ', this.param);
    this.getAddressList();
    this.fetchStateList();

    this.route.queryParams.subscribe(params => {
      if (params['productSummary']) {
        this.productSummary = params['productSummary'];
this.productSummaryTransfer = this.productSummary;
        
        console.log("Product Summary---------------------=:", this.productSummary);
      }
    });
    
  }

  toggleCard() {
    this.isCardOpen = !this.isCardOpen;
  }

  getAddressList() {
    this.isLoading = true; // Set loading flag to true
    this.authService.postData(this.param, 'addresslist').then((res: any) => {
      if(res.address.length > 0){
      this.AddressList = res.address;
      this.selectedCardIndex=0;
      }
      console.log("Address List: ", this.AddressList);
    }).catch(error => {
      console.error('Error fetching address list:', error);
    }).finally(() => {
      this.isLoading = false; // Set loading flag to false regardless of success or failure
    });
  }
  

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...', // Message to display in the loading indicator
      spinner: 'crescent', // Type of spinner to display
      translucent: true, // Whether to make the background translucent
      cssClass: 'custom-loading' // Custom CSS class for styling
    });
    await loading.present();
  }

  fetchStateList() {
    this.isLoading = true; // Set loading flag to true
    this.authService.postData(this.param, 'stateList').then((res: any) => {
      this.stateList = res.stateList;
      console.log("States: ", this.stateList);
    }).catch(error => {
      console.error('Error fetching state list:', error);
    }).finally(() => {
      this.isLoading = false; // Set loading flag to false regardless of success or failure
    });
  }

  addCard() {
    if (this.isFormValid()) {
      this.newAddress.token = this.param.userData.token;
      this.newAddress.customer_id = this.param.userData.customer_id;
      this.newAddress.email = this.param.userData.email;

      this.authService.postData(this.newAddress, 'addAddress').then((res: any) => {
        console.log("----------->>>", res)
        this.AddressList.push({ ...this.newAddress, email: this.param.email, token: this.param.token, customer_id: this.param.customer_id });
        this.clearNewAddress();
        this.getAddressList(); 
      }).catch(error => {
        console.error("Error adding address:", error);
      });
    } else {
      console.log('New address is invalid');
    }
  }

  deleteCard(index: number) {
    this.AddressList.splice(index, 1);
  }

  selectCard(index: number): void {
    this.selectedCardIndex = index;
    this.isAddressSelected = true;

    const selectedAddress = this.AddressList[index];
    if (selectedAddress && selectedAddress.adrs_id) {
      this.addressID = selectedAddress.adrs_id; 
    } else {
      console.error("Selected address or adrs_id not found.");
    }
  }

  

  stateList: { name: string, value: string }[] = [];

  isFormValid(): boolean {
    const isValidPhone = /^\d{10}$/.test(this.newAddress.phone.trim());

    return (
      this.newAddress.first_name.trim() !== '' &&
      this.newAddress.last_name.trim() !== '' &&
      this.newAddress.address.trim() !== '' &&
      this.newAddress.landmark.trim() !== '' &&
      this.newAddress.locality.trim() !== '' &&
      isValidPhone &&
      this.newAddress.pincode.trim() !== '' &&
      this.newAddress.city.trim() !== '' &&
      this.newAddress.state.trim() !== ''
    );
  }

  clearNewAddress() {
    this.newAddress = {
      address: '',
      city: '',
      first_name: '',
      landmark: '',
      last_name: '',
      locality: '',
      phone: '',
      pincode: '',
      state: '',
      email: this.param.email,
      token: this.param.token,
      customer_id: this.param.customer_id
    };
  }

  isAddressSelected: boolean = false;

  goToPaymentPage(addressID: any) {
    if (addressID ) {
        const queryParams = {
        addressID: addressID,
        products: this.products, 
        productSummary: this.productSummaryTransfer
      };     
  
      this.router.navigate(['/payment'], { queryParams: queryParams });
  
      
    } else {
      
      console.log('Address ID:=============================', addressID);
    
    }
  }
  
}



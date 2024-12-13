import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementRef, ViewChildren, ViewChild } from '@angular/core';
import type { QueryList } from '@angular/core';
import type { Animation } from '@ionic/angular';
import { AnimationController, IonCard } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

declare var Razorpay: any;


@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  animations: [
    trigger('slideUp', [
      state('void', style({
        transform: 'translateY(100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('void => *', animate('300ms ease-in')),
      transition('* => void', animate('300ms ease-out'))
    ])
  ]
})
export class PaymentPage implements OnInit {

  @ViewChild(IonCard, { read: ElementRef }) card!: ElementRef<HTMLIonCardElement>;
  @ViewChildren(IonCard, { read: ElementRef }) cardElements!: QueryList<ElementRef<HTMLIonCardElement>>;

  private animation!: Animation;

  totalAmount!: number;
  products!: any[];
  paymentOption!: string;
  addressID!: string; // Declare variable to store address ID
  addressDetails: any;
  productSummary: any;
  prods: any;
  subT: any;
  Summ: any;
  

  animationPlayed!: boolean;
  
  private cardB2!: Animation;
  private cardA2!: Animation;


  AddressList: any[] = [];
  isLoading: boolean = false;
  param: any;
  Summary: any[] = [];
  userSpecAdd: any;


  constructor(    
    private authService: AuthServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private animationCtrl: AnimationController,
    private toastController: ToastController,
    // private callNumber: CallNumber
) { }

  
  getAddressList() {
    this.param = JSON.parse(localStorage.getItem("userData")!);
    console.log('User Data---------------------> : ', this.param);
    this.isLoading = true; 
    this.authService.postData(this.param, 'addresslist').then((res: any) => {
      this.AddressList = res.address;
      console.log("Address List------------------------------------> payment page: ", this.AddressList);     
      const addressID = this.route.snapshot.queryParams['addressID'];
      if (addressID) {        
        this.userSpecAdd = this.AddressList.find((address: any) => address.adrs_id === addressID);
        console.log("User specific address:", this.userSpecAdd);
      }
    }).catch(error => {
      console.error('Error fetching address list:', error);
    }).finally(() => {
      this.isLoading = false; 
    });
  }    
  
  ngAfterViewInit() {

    
    if (this.cardElements && this.cardElements.length > 0) {
      this.animationPlayed = true; 


      this.cardB2 = this.animationCtrl
      .create()
      .addElement(this.cardElements.first.nativeElement)
      .fill('none')
      .duration(800)
      .keyframes([
        { offset: 0, transform: 'scale(0.5)', opacity: '1' },
        { offset: 0.5, transform: 'scale(1)', opacity: '0.3' },
        { offset: 1, transform: 'scale(1)', opacity: '1' },
      ]);


      this.cardA2 = this.animationCtrl
      .create()
      .addElement(this.cardElements.last.nativeElement)
      .fill('none')
      .duration(1000)
      .keyframes([
        { offset: 0, transform: 'scale(1)', opacity: '1' },
        { offset: 0.5, transform: 'scale(1.2)', opacity: '0.3' },
        { offset: 1, transform: 'scale(1)', opacity: '1' },
      ]); 
      
      this.animation = this.animationCtrl
        .create()
        .duration(2000)
        .iterations(1)
        .addAnimation([this.cardB2,   this.cardA2]);
        this.cardB2.play();
        
        
    }
  }

  
  handlePayment() {
    if (this.paymentOption === 'paypal') {
      this.payWithRazor();
    } else if (this.paymentOption === 'cashOnDelivery') {
      this.presentToast('middle');
    }
  }

  async presentToast(position: 'middle') {
    const toast = await this.toastController.create({
      message: 'Your Order will be delivered to this address: ' + 
             `${this.userSpecAdd.address}, ${this.userSpecAdd.city}, ${this.userSpecAdd.landmark}, ${this.userSpecAdd.state} by:`,
      duration: 2000,
      position: position,
      cssClass: 'custom-toast-message', // Apply custom CSS class
      buttons: [
        {
          side: 'end', // Align the icon to the end (right) of the toast
          icon: 'checkmark-circle-outline' // Specify the icon to use
        }
      ]
    });
  
    await toast.present();
  }
  
  
ngOnInit(): void {
  this.getAddressList();
  this.route.queryParams.subscribe(params => {
    if (params['productSummary']) {        
      const productSummary = JSON.parse(params['productSummary']);       
      console.log("Summary---------payment __page--->:", productSummary.summary);
      console.log("Subtotal-->:", productSummary.subtotal);

      this.subT = productSummary.subtotal;
      this.Summ = productSummary.summary;

      
      if (productSummary.images) {
     
        for (let i = 0; i < this.Summ.length; i++) {
          this.Summ[i].image = productSummary.images[i];
        }
      }
      console.log("Product Summary with Images:", this.Summ);
    }

    if (params['addressID']) {
      const addressID = params['addressID'];
      console.log("Address ID:", addressID);
    }
  });
}

  
  makePayment() {
    this.router.navigate(['/payment-success']);
  }


  payWithRazor(){

    const RazorpayOptions  ={
      description: 'Sample Razorpay demo',
      currency:'INR',
      amount:this.subT*100,
      name: 'Petba.in',
      key: 'rzp_test_Pd1uy6stEdFpMs',
      image: '',
      prefill:{
        name: '',
        email: '',
        phone: '',

      },
      theme: {
        color: 'red',
        },
        modal: {
          ondismiss: () => {
            console.log('dismissed')
          }
        }
    }
    const successCallback = (paymentid:any) => {
      console.log(paymentid);
    }
    const failureCallback = (e:any) => {
      console.log(e);
    }    
    Razorpay.open(RazorpayOptions,successCallback, failureCallback)




  }







}

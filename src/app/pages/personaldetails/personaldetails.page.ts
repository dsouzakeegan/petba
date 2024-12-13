
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
declare var Razorpay: any;
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
@Component({
  selector: 'app-personaldetails',
  templateUrl: './personaldetails.page.html',
  styleUrls: ['./personaldetails.page.scss'],
})
export class PersonaldetailsPage implements OnInit {
  num:any
  readonly phoneMask: MaskitoOptions = {
    mask: [/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/],
  };

  readonly maskPredicate: MaskitoElementPredicate = (el: HTMLElement) => {
    return (el as HTMLIonInputElement).getInputElement();
  };

  userData: any;
  detailsForm!: FormGroup; 
  donationAmount!: number;

  billingAddressFocused: boolean = false;
pincodeFocused: boolean = false;


  // param: any;
  // isLoading!: boolean;
  // AddressList: any;
  // userSpecAdd: any;

  constructor(private formBuilder: FormBuilder, private router: Router,private route: ActivatedRoute, private authService: AuthServiceService,) { }
 
  ngOnInit() {


    // this.param = JSON.parse(localStorage.getItem("userData")!);
    // console.log('User Data---------------------> : ', this.param);
    // this.isLoading = true; 
    // this.authService.postData(this.param, 'addresslist').then((res: any) => {
    //   this.AddressList = res.address;
    //   console.log("Address List------------------------------------> personal detail page: ", this.AddressList);     
    //   const addressID = this.route.snapshot.queryParams['addressID'];
    //   if (addressID) {        
    //     this.userSpecAdd = this.AddressList.find((address: any) => address.adrs_id === addressID);
    //     console.log("User specific address:", this.userSpecAdd);
    //   }
    // }).catch(error => {
    //   console.error('Error fetching address list:', error);
    // }).finally(() => {
    //   this.isLoading = false; 
    // });

    this.userData = JSON.parse(localStorage.getItem("userData") || '{}');
    this.detailsForm = this.formBuilder.group({
      fullName: [`${this.userData?.userData?.firstname} ${this.userData?.userData?.lastname}`, Validators.required],
       });
    this.userData = JSON.parse(localStorage.getItem("userData")!);
    console.log('User Data---------------------> : ', this.userData);

    this.detailsForm = this.formBuilder.group({
      fullName: [`${this.userData?.userData?.firstname} ${this.userData?.userData?.lastname}`], 
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]\d*$/)] ],
      email: [this.userData?.userData?.email], 
      billingAddress:[ ''],
      pincode: [''],
    });

    this.route.paramMap.subscribe(params => {      
      const state = window.history.state;
      this.donationAmount = state.donationAmount;
    });

    
  }



  onKeyPress(event: KeyboardEvent) {
    const allowedCharacters = /^[0-9]*$/; 
    if (!allowedCharacters.test(event.key)) {
      event.preventDefault(); 
    }
  }


  getUserData(){   
  }

  donate(amount: number) {
    this.router.navigate(['/personaldetails'], { state: { donationAmount: amount } });
  }


  


  handleDonation() {
    Object.keys(this.detailsForm.controls).forEach(key => {
      const control: AbstractControl | null = this.detailsForm.get(key);
  
      if (control && control.invalid && control.untouched) {
        control.markAsTouched();
      }
    });
    if (this.detailsForm.valid) {
      console.log('Processing donation...');
      console.log(this.detailsForm.value);
      this.payWithRazor();
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
    

}


payWithRazor(){

  const RazorpayOptions  ={
    description: 'Sample Razorpay demo',
    currency:'INR',
    amount: this.donationAmount*100,
    name: this.userData?.userData?.firstname,
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
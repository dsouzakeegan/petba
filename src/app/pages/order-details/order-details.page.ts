import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
// import { User } from 'src/app/interfaces/User';
import { AuthServiceService } from 'src/app/services/auth-service.service';
interface orderDetailApi {
  address_1: string;
  address_2: string;
  city: string;
  company: string;
  date_modified: string;
  firstname: string;
  image: string;
  lastname: string;
  name: string;
  order_id: string;
  order_status: string;
  order_status_code: string;
  payment_method: string;
  postcode: string;
  price: string;
  product_id: string;
  telephone: string;
  shipping_date: string;
}


interface orderResultData {
  address_1: string;
  address_2: string;
  city: string;
  company: string;
  date_modified: string;
  firstname: string;
  image: string;
  lastname: string;
  name: string;
  order_id: string;
  order_status_code: string;
  order_status: string;
  payment_method: string;
  postcode: string;
  price: string;
  product_id: string;
  telephone: string;
  shipping_date:string;
}
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  imgUrl:string;
order_detail:orderResultData={
      
  address_1:""
  ,address_2:""
  ,city:""
  ,company:""
  ,date_modified:""
  ,firstname:""
  ,image:""
  ,lastname:""
  ,name:""
  ,order_id:""
  ,order_status:""
  ,order_status_code:""
  ,payment_method:""
  ,postcode:""
  ,price:""
  ,product_id:""
  ,telephone:"",
  shipping_date:""
      }
PARAM={c_id:"",product_id:""};
Loading:boolean=true;
  constructor(
    private authService : AuthServiceService,
    private router : Router,
  ) { 
    this.imgUrl=authService.img2();
    this.PARAM.c_id=JSON.parse(localStorage.getItem('userData')!).userData.customer_id;
    let a :any =this.router.getCurrentNavigation()?.extras.state;
    this.PARAM.product_id = a.order_product;
    console.log(a);
    console.log(this.PARAM);
    
  }

  ngOnInit() {
    this.getOrderHistory();
  }

 async getOrderHistory()
  {
   this.Loading=true;
    
    await this.authService.postData(this.PARAM,'loadMyOrderHistory').then((result:any)=>{
      let details = result.loadOrderHistory;
if(details)
{
  this.order_detail.address_1         =    details.address_1          &&  details.address_1        ;
  this.order_detail.address_2         =    details.address_2          &&  details.address_2        ;
  this.order_detail.city              =    details.city               &&  details.city             ;
  this.order_detail.company           =    details.company            &&  details.company          ;
  this.order_detail.date_modified     =    details.date_modified      &&  details.date_modified    ;
  this.order_detail.firstname         =    details.firstname          &&  details.firstname        ;
  this.order_detail.image             =    details.image              &&  this.imgUrl+details.image;
  this.order_detail.lastname          =    details.lastname           &&  details.lastname         ;
  this.order_detail.name              =    details.name               &&  details.name             ;
  this.order_detail.order_id          =    details.order_id           &&  details.order_id         ;
  this.order_detail.order_status      =    details.order_status       &&  details.order_status     ;
  this.order_detail.order_status_code =    details.order_status_code  &&  details.order_status_code;
  this.order_detail.payment_method    =    details.payment_method     &&  details.payment_method   ;
  this.order_detail.postcode          =    details.postcode           &&  details.postcode         ;
  this.order_detail.price             =    details.price              &&  details.price            ;
  this.order_detail.product_id        =    details.product_id         &&  details.product_id       ;
  this.order_detail.telephone         =    details.telephone          &&  details.telephone        ;
  this.order_detail.shipping_date     =    details.shipping_date      &&  details.shipping_date    ;
// this.order_detail=this.transFormData(result.loadOrderHistory);
console.log(details);
console.log(this.order_detail);

}
    }).catch((error)=>{console.error(error);
    }).finally(()=>{

   this.Loading=false;

    })


  }

}


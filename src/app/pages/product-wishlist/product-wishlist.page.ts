import { Component, OnInit } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { User } from 'src/app/interfaces/User';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
interface Product{
  name: string;
  categories: string|string[];
  price: string;
  p_id: string;
  images: string;
  off: string | null;
  originalPrice: string | null;
}
interface APIProduct {
  brand: string;
  category: string;
  description: string;
  discount: string;
  image: string;
  model: string;
  name: string;
  price: string;
  product_id: string;
  quantity: string;
  specialprice: string|null;
}
@Component({
  selector: 'app-product-wishlist',
  templateUrl: './product-wishlist.page.html',
  styleUrls: ['./product-wishlist.page.scss'],
})
export class ProductWishlistPage implements OnInit {
USER :User;
  wishedProducts:Product[]=[];
  Loading: boolean=true;
  imgUrl:string;
  constructor(
    private authService:AuthServiceService,
    private alertCntrl:AlertServiceService,

  ) {
    this.USER = JSON.parse(localStorage.getItem('userData')!);
    this.imgUrl = this.authService.img2();
   }

  ngOnInit() {
    this.getWishlistProducts();
  }

  async getWishlistProducts()
  {
    this.wishedProducts=[];
    this.Loading=true;
    await this.authService.postData(this.USER, "wishlist").then((result:any) =>{
      if(result.wishProducts.length > 0){
        // const dataLength = result.categoryProducts.length;
        // this.lastCreated_Id =dataLength;
       this.wishedProducts =   this.DataTransformToDisplay(result.wishProducts);
      }
console.log(this.wishedProducts)
    }).catch((error)=>{console.error(error)}).finally(()=>{
      this.Loading=false;
    })
    }
   // TRANSFORM THE DATA FROM API INTO THE VIEW STRUCTURED
   DataTransformToDisplay(data:APIProduct[]):Product[]{
    if(data.length > 0)
    {
      var prop:Product[]= [];
      for(let pro of data )
      {
        let price;
        let oririnalPrice;
        let off ;
        let pri;
        let oriprice
        if(pro.specialprice != null){
          price=null;
          oririnalPrice=null;
          off=null;
          pri=null;
          oriprice=null;
          price=pro.specialprice;
          oririnalPrice=pro.price;
          pri=(JSON.parse(price)).toFixed(2);
          oriprice=(JSON.parse(oririnalPrice)).toFixed(2);
          // off=(100-((JSON.parse(pri)/JSON.parse(oriprice))*100)).toFixed(0);
          off=(100-((pri/oriprice)*100)).toFixed(0);
          
    
         }else{
          price=null;
          oririnalPrice=null;
          pri=null;
          oriprice=null;
          off=null;
          price=pro.price;
         }
             let proc =  {
                           name: pro.name,
                           categories: pro.category,
                           price: price,
                           p_id: pro.product_id,
                           images:this.imgUrl+pro.image,
                           off: off,
                          originalPrice: oririnalPrice
                         }
             prop.push(proc);        
           
      }
      return prop;
    }else{
      return [];
    }
   
  }
  Refresh(event:RefresherCustomEvent)
  {
    this.getWishlistProducts();
    setTimeout(() => {
      event.target.complete();
    }, 3000);
  }
  removeItem_fromWishlist(product:Product)
  { 
    let param ={
      userData:
      {
        ...this.USER.userData,
        product_id:product.p_id
      }
    }
this.authService.postData(param,'deletewisheditem').then((result:any)=>{
  if(result.delet){
    let deleted=result.delet;
    console.log(deleted);
    this.wishedProducts.splice(this.wishedProducts.indexOf(product), 1);
    // this.presentToast(deleted);
   }
   else{
     //this.presentToast("Something  went wrong?);
   }
}).catch((error)=>{
  console.error(error);
}).finally(()=>{
  // this.Loading =false;
})
  }

  presentConfirmationAlert(product:Product)
  {
    let  buttonOptions = [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass:'button-text-capitalize',
        handler: () => {
          console.log('Alert canceled');
        },
      },
      {
        text: 'Remove',
        cssClass:'remove-button button-text-capitalize',
        role: 'confirm',
        handler: () => {
          console.log('Alert confirmed');
          this.removeItem_fromWishlist(product);
        },
      },
    ];
    this.alertCntrl.present("Remove",buttonOptions,"remove this product from your wishlist?");
  }
}

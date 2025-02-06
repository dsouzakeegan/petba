// Home.page.ts

import { Component, OnInit } from '@angular/core';
import { ModalController, RefresherCustomEvent } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/interfaces/User';
import { pageProductType } from 'src/app/interfaces/pageType';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { PetPage } from '../Add/pet/pet.page';
import { RescuepetPage } from '../Add/rescuepet/rescuepet.page';
import { FcmService } from 'src/app/services/fcm/fcm.service';
import { SelectCityComponent } from 'src/app/components/city/select-city/select-city.component';
import { ChatService } from 'src/app/services/chat/chat.service';
import { CityService } from 'src/app/services/city/city.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

const LOCATION_KEY='_location';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  _services=[
    {id:"1",path:"list/1",name:"Vets",img:"vets"}
    ,{id:"2",path:"list/2",name:"Shelters",img:"shelter"}
    ,{id:"3",path:"list/3",name:"Groomers",img:"grooming"}
    ,{id:"4",path:"list/4",name:"Trainers",img:"training"}
    ,{id:"5",path:"list/5",name:"Fosters",img:"foster"}
    ,{id:"6",path:"rescues",name:"Rescues",img:"rescuepet"}
  ]
User:User|undefined;
pageProductType=pageProductType;
Loading:boolean=true;
  // img :string="https://storage.pixteller.com/designs/designs-images/2021-01-01/01/dog-food-premium-pet-food-1-5fef0b9749bb8.png"
  topcat: any;
  cartTotal: any;
  banner: any;
  banner2: any[] = [];
  rescue: any;
  adoption: any;
  img1: any;
  img2: any;
  img3: any;
  img4: any;
  featured: { name: any; categories: any; price: any; p_id: any; images: any; off: string | null; originalPrice: any; }[] = [];
  special: { name: any; categories: any; price: any; p_id: any; images: any; off: string | null; originalPrice: any; }[] = [];
  latest: { name: any; categories: any; price: any; p_id: any; images: any; off: string | null; originalPrice: any; }[] = [];
  imgUrl: string;
  imgUrl2: string;
  featuredid: any;
  location: { city_id: string, city: string } = { city_id: '', city: '' };
  address: any;
  popular: any;
  totalUnreadMessages: number = 0;

  chatRooms$!: Observable<any[]>;  // Declare chatRooms$ as an Observable of an array of any type

  constructor( 
    private myApp : AppComponent
   ,private authService:AuthServiceService
   ,private modalCtrl:ModalController
   ,private fcm:FcmService
   ,private chatService: ChatService // Inject ChatService
   ,private cityService: CityService
   ,private router: Router
  ) { 
        //TODO//
  // GET GEO LOCATION
  this.imgUrl = this.authService.img();
  this.imgUrl2 = this.authService.img2();
  }

  getLocation():{city_id:string,city:string}
  {
    // get location from local storage
  const data = localStorage.getItem(LOCATION_KEY);
 return(data ? JSON.parse(data): {city:'',city_id:''}) ;
  }
  setLocation(location:{city_id:string,city:string})
  {
   try{ 
    if(location)
      {
        localStorage.setItem(LOCATION_KEY,JSON.stringify(location));
      }
      return true;
    }
    catch(e)
    {
      console.error(e);
      return false
    }
  }
  ngOnInit() {
    if (this.myApp.checkLoggedIn()) {
      this.myApp.menuCntrl.enable(true, 'petba-main-menu');
      this.location = this.cityService.getSavedCity();
      this.cityService.changeCity(this.location);
      this.getData();
      console.log('Menu Enabled... ');
      this.User = JSON.parse(localStorage.getItem("userData")!);
      this.fcm.initPush();
      this.getUnreadMessagesTotal();  // Fetch and calculate unread messages
    }
  }

  navigateToCamera(): void {
    this.router.navigate(['/camera']); // Navigate to the Camera
  }

  async selectLocation(type: 'city' | 'all') {
    if (type === 'city') {
      const modal = await this.modalCtrl.create({
        component: SelectCityComponent,
      });
      await modal.present();
  
      const { data, role } = await modal.onWillDismiss();
      if (role === 'confirm') {
        this.location.city = data.city;
        this.location.city_id = data.city_id;
  
        if (this.setLocation(this.location)) {
          this.cityService.changeCity(this.location);  // Update the city in the service
          this.getData();
        }
      }
    } else if (type === 'all') {
      // Set location to all cities in Goa
      this.location.city = 'Goa';
      this.location.city_id = 'GA30';  // Set the city_id to a default value representing all cities in Goa
  
      if (this.setLocation(this.location)) {
        this.cityService.changeCity(this.location);  // Update the city in the service
        this.getData();  // Refresh data to show all adoption listings from Goa
      }
    }
  }
    
 async getData()
  {
    const customerId = this.User?.userData?.customer_id || '';
    // const locationParams = { ...this.location };
      // get location from local storage
    this.location = this.getLocation();
   let locationParams = this.getLocation();
    this.Loading=true;
    if(this.location.city_id == 'GA30')locationParams.city_id='';
    this.authService.postData({customer_id: customerId,...this.location},"dashboard").then((res :any ) => {

      console.log("DASHBOARD", res);

      if (res.topcat) {
        // this.topCategory = this.constants.topCategory;
        this.topcat = res.topcat;
      }
      if (res.total) {
        this.cartTotal = res.total.total;
      }    
      if (res.banner) {
        let a:any[] =res.banner 
        // console.log(a);

        this.banner = a.map((item:any)=>{
          if (item.hasOwnProperty('image')) {
            item.img = this.imgUrl2 + item.image;
            delete item.image; // Delete the old property
          }
          return item;

        });
          //  console.log(this.banner);
      }
      if (res.rescueListhome) {
        this.rescue = res.rescueListhome;
      }
      if (res.adoption) {
        this.adoption = res.adoption;
      }
      if (res.imageBanner) {
        for (let image of res.imageBanner) {
          // console.log("++++++++++" + image.flag + image.imgLink);
          if (image.flag == 1) {
        
            this.img1={
              img:this.imgUrl+image.imgLink,
              product:image.product_id,
            }
            this.banner2.push(this.img1);
          }  if (image.flag == 2) {
            this.img2={
              img:this.imgUrl+image.imgLink,
              product:image.product_id,
            }
            this.banner2.push(this.img2);
          } else if (image.flag == 3) {
            this.img3={
              img:this.imgUrl+image.imgLink,
              product:image.product_id,
            }
            this.banner2.push(this.img3);
          } else if (image.flag == 4) {
            this.img4={
              img:this.imgUrl+image.imgLink,
              product:image.product_id,
            }
            this.banner2.push(this.img4);
           
          }
        }
      }

      if (res.featured) {
        this.featuredid = JSON.parse(
          res.featured[0].setting
        ).product;
        let a = { product: this.featuredid };
        // console.log(this.featuredid)
        this.authService.postData(a, "featuredproducts").then(
          (result:any) => {
            // console.log(result);
            if (result.featuredproducts) {
              var prop = [];
              let price;
              let oririnalPrice;
              let off;
              let pri;
              let oriprice;
              for (let pro of result.featuredproducts) {
                if (pro.specialprice != null) {
                  price = null;
                  oririnalPrice = null;
                  off = null;
                  price = pro.specialprice;
                  oririnalPrice = pro.price;

                  pri = null;
                  oriprice = null;
                  pri = JSON.parse(price).toFixed(2);
                  oriprice = JSON.parse(oririnalPrice).toFixed(2);
                  off = (
                    100 -
                    (JSON.parse(pri) / JSON.parse(oriprice)) * 100
                  ).toFixed(2);
                } else {
                  price = null;
                  oririnalPrice = null;
                  pri = null;
                  oriprice = null;
                  off = null;
                  price = pro.price;
                }
                let proc = {
                  name: pro.name,
                  categories: pro.category,
                  price: price,
                  p_id: pro.product_id,
                  images: pro.image,
                  off: off,
                  originalPrice: oririnalPrice,
                };
                prop.push(proc);
              }
              this.featured = prop;
              // console.log("Featured : ",this.featured);

              ///
            }
          },
          (err) => {
            console.error("error: " + err);
          }
        );
      }
      if (res.latest) {
        var prop = [];
        let price;
        let oririnalPrice;
        let off;
        let pri;
        let oriprice;
        for (let pro of res.latest) {
          if (pro.specialprice != null) {
            price = null;
            oririnalPrice = null;
            off = null;
            price = pro.specialprice;
            oririnalPrice = pro.price;

            pri = null;
            oriprice = null;
            pri = JSON.parse(price).toFixed(2);
            oriprice = JSON.parse(oririnalPrice).toFixed(2);
            off = (
              100 -
              (JSON.parse(pri) / JSON.parse(oriprice)) * 100
            ).toFixed(0);
          } else {
            price = null;
            oririnalPrice = null;
            pri = null;
            oriprice = null;
            off = null;
            price = pro.price;
          }
          let proc = {
            name: pro.name,
            categories: pro.category,
            price: price,
            p_id: pro.product_id,
            images: pro.image,
            off: off,
            originalPrice: oririnalPrice,
          };
          prop.push(proc);
        }
        this.latest = prop;
        // console.log("Latest : ", this.latest);
      }
      if (res.special) {
        var prop = [];
        let price;
        let oririnalPrice;
        let off;
        let pri;
        let oriprice;
        for (let pro of res.special) {
          if (pro.specialprice != null) {
            price = null;
            oririnalPrice = null;
            off = null;
            price = pro.specialprice;
            oririnalPrice = pro.price;

            pri = null;
            oriprice = null;
            pri = JSON.parse(price).toFixed(2);
            oriprice = JSON.parse(oririnalPrice).toFixed(2);
            off = (
              100 -
              (JSON.parse(pri) / JSON.parse(oriprice)) * 100
            ).toFixed(0);
          } else {
            price = null;
            oririnalPrice = null;
            pri = null;
            oriprice = null;
            off = null;
            price = pro.price;
          }
          let proc = {
            name: pro.name,
            categories: pro.category,
            price: price,
            p_id: pro.product_id,
            images: pro.image,
            off: off,
            originalPrice: oririnalPrice,
          };
          prop.push(proc);
        }
        this.special = prop;
        
      }
      /*
--------------
||Best Test
--------------
*/
      if (res.best) {
        this.featuredid = JSON.parse(
          res.featured[0].setting
        ).product;
        let a = { product: this.featuredid };
        //call server for featured products
        this.authService.postData(a, "featuredproducts").then(
          (result :any) => {
            if (result.featuredproducts) {
              var prop = [];
              let price;
              let oririnalPrice;
              let off;
              let pri;
              let oriprice;
              for (let pro of result.featuredproducts) {
                if (pro.specialprice != null) {
                  price = null;
                  oririnalPrice = null;
                  off = null;
                  price = pro.specialprice;
                  oririnalPrice = pro.price;

                  pri = null;
                  oriprice = null;
                  pri = JSON.parse(price).toFixed(2);
                  oriprice = JSON.parse(oririnalPrice).toFixed(2);
                  off = (
                    100 -
                    (JSON.parse(pri) / JSON.parse(oriprice)) * 100
                  ).toFixed(2);
                } else {
                  price = null;
                  oririnalPrice = null;
                  pri = null;
                  oriprice = null;
                  off = null;
                  price = pro.price;
                }
                let proc = {
                  name: pro.name,
                  categories: pro.category,
                  price: price,
                  p_id: pro.product_id,
                  images: pro.image,
                  off: off,
                  originalPrice: oririnalPrice,
                };
                prop.push(proc);
              }
              this.latest = prop;
              // console.log("Best Test [Latest]", this.latest);
            }
          },
          (err) => {
            console.error("Error on best: " + err);
          }
        );
      } else {
        console.warn("BEST EMPTY");
      }

      /*
-----------------
||BEST END
-----------------
*/
    }).catch((err)=>{console.error("ERROR : ",err);}
    ).finally(()=>{
      this.Loading=false;
    })
  }
  
  async openPetForm(type:number) { 
    if(type=== 1 || type === 2)
    {
      const modal = await this.modalCtrl.create({
        component:PetPage,componentProps:{type : type}
      });
      modal.present();
    }else if(type === 3)
    {
      const modal = await this.modalCtrl.create({
        component:RescuepetPage,componentProps:{type : type}
      });
      modal.present();
    }
  
  }

  Refresh(event:RefresherCustomEvent )
  {
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 3000);
  }

  getUnreadMessagesCount(chatRoom: any): number {
    if (!chatRoom || !chatRoom.messages) {
      return 0;
    }
    return chatRoom.messages.filter(
      (msg: any) => !msg.seen && msg.senderId !== this.chatService.currentUserId
    ).length;
  }


  getUnreadMessagesTotal() {
    this.chatService.getChatRooms();  // Fetch chat rooms when HomePage initializes
    this.chatRooms$ = this.chatService.chatRooms;  // Assign the Observable
    this.chatRooms$.subscribe(chatRooms => {
      this.totalUnreadMessages = chatRooms.reduce((total, room) => {
        return total + this.getUnreadMessagesCount(room);
      }, 0);
    });
  }
}

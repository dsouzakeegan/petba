import { Component, OnInit } from '@angular/core';
import { ActionSheetController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { IonSegmentCustomEvent, SegmentChangeEventDetail, SegmentValue } from '@ionic/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { RescueFilterComponent } from 'src/app/components/rescue-filter/rescue-filter.component';
import { Position } from '@capacitor/geolocation';
export interface fiterOptions{
  city:string[],
  condition:string[],
  animalType:string[],
  gender:string[],
}
export interface Rescue {
  ConditionType: string
  Distance: string
  PID: string
  address: string
  city: string
  conditionLevel_id: string
  description: string
  id: string
  img1: string
  latitude: string
  longitude: string
  status: string
}
@Component({
  selector: 'app-rescues',
  templateUrl: './rescues.page.html',
  styleUrls: ['./rescues.page.scss'],
})

export class RescuesPage implements OnInit {
  noMoreMyRescueListData: boolean=false;;
  noMoreAllRescueListData:boolean=false;
  allRescueParams:{c_id:null,latitude:number|string,longitude:number|string,lastPet:number,filter:string|fiterOptions,sort:string};
  myRescueParams:{c_id:string,latitude:number|string,longitude:number|string,lastPet:number,filter:string|fiterOptions,sort:string};
  allrescueList:Rescue[]=[]
  myRescueList:Rescue[]=[]
imgUrl:string;
tabSelected="";
tabTitle="";
pageTitle="";
Dummy_title="Paws of Hope: Rescuing Innocence. Join our mission to save furry lives! Every adoption is a tale of redemption. Be a hero to those who can't speak. Adopt, foster, donate. Together, we make a difference. 🐾❤️ #RescueRevolution #FurryHeroes"
  Loading: boolean=true;
constructor(
  private geoLocation : GeolocationService,
private actionSheetCtrl :ActionSheetController,
private modalCtrl :ModalController,
  private authService : AuthServiceService
) { 
  this.imgUrl=this.authService.img();
  let id = JSON.parse(localStorage.getItem('userData')!).userData.customer_id ;
  // geolocation.getCurrentLocation()
  this.allRescueParams={c_id:null,latitude:15.2993,longitude:74.1240,lastPet:0,filter:"",sort:""};
  this.myRescueParams={c_id:id,latitude:15.2993,longitude:74.1240,lastPet:0,filter:"",sort:""};

  // By defualt sort 
  this.allRescueParams.sort = '1';
  this.LocationSort()
}

ngOnInit() {
  this.tabChange("all");
  }
async getMyRescues(){
 
    this.Loading=true;
    this.myRescueParams.lastPet=0;
  //  this.allrescueList.length == 0 ? this.Loading =true : this.Loading = false; //check if data is present already 
   await this.authService.postData(this.myRescueParams,"rescueList").then((result:any)=>{
     if(result.rescueList.length > 0){
       this.myRescueList.push(...result.rescueList);
       this.myRescueParams.lastPet+=result.rescueList.length;
     }
    }).catch((error)=>{
      console.error(error);
    }).finally(()=>{this.Loading=false;})



  }
async getAllRescues()
  {
    this.Loading=true;
    this.allrescueList=[];
    this.allRescueParams.lastPet=0;
  //  this.allrescueList.length == 0 ? this.Loading =true : this.Loading = false; //check if data is present already 
   await this.authService.postData(this.allRescueParams,"rescueList").then((result:any)=>{
     if(result.rescueList.length > 0){

       this.allrescueList.push(...result.rescueList);
       this.allRescueParams.lastPet+=result.rescueList.length;
     }
    }).catch((error)=>{
      console.error(error);
    }).finally(()=>{this.Loading=false;})

  }
tabChange(a:string)
{

  if(a == "all")
  {
    this.allrescueList.length == 0 ? this.getAllRescues(): null;
    this.tabSelected = "all";
   this.pageTitle="Rescues";
  }else if(a  == "my"){
    this.tabSelected = "my";
    this.myRescueList.length == 0 ? this.getMyRescues(): null;
    this.pageTitle="My Rescues";
  }
}
async onIonInfinite(ev :Event) {

  if(this.tabSelected === "all")
  {
   await this.authService.postData(this.allRescueParams,"rescueList").then((result:any)=>{
      if(result.rescueList.length > 0){
 
        this.allrescueList.push(...result.rescueList);
        this.allRescueParams.lastPet+=result.rescueList.length;
      } else if(result.rescueList.length == 0)
      {
        this.noMoreAllRescueListData =true;
      }
     }).catch((error)=>{
       console.error(error);
     }).finally(()=>{
      (ev as InfiniteScrollCustomEvent).target.complete();
     })
 

  }
  if(this.tabSelected === "my")
  {
    await this.authService.postData(this.myRescueParams,"rescueList").then((result:any)=>{
      if(result.rescueList.length > 0){
 
        this.myRescueList.push(...result.rescueList);
        this.myRescueParams.lastPet+=result.rescueList.length;
      } else if(result.rescueList.length == 0)
      {
        this.noMoreMyRescueListData =true;
      }
     }).catch((error)=>{
       console.error(error);
     }).finally(()=>{
      (ev as InfiniteScrollCustomEvent).target.complete();
     })
 
  }
}
async LocationSort()
  {
      // Get Location Latitude And Longitude
  const {location , status} = await this.geoLocation.getCurrentLocation();
  if (status === 200) {
    this.allRescueParams.latitude = (location as Position).coords.latitude;
      this.allRescueParams.longitude =(location as Position).coords.longitude; 
        
  }
  this.getAllRescues();
  }
async presentSort() {
  const actionSheet = await this.actionSheetCtrl.create({
    header: 'Sort By',
    cssClass:'custom-sort-actionSheet',
    buttons: [
      
      {
        text: 'Location(nearest)',
        role:     this.allRescueParams.sort == '1' ? 'selected' :"",
        handler:()=>{
          this.allRescueParams.sort = '1';
          this.LocationSort()
          
        }
      },
      {
        text: 'Most Recent',
        role:     this.allRescueParams.sort == '2' ? 'selected' :"",
        handler:()=>{
          this.allRescueParams.sort = '2';
          this.getAllRescues();
        }
        // data: {
        //   action: 'share',
        // },
      },
      // {
      //   text: 'Cancel',
      //   role: 'cancel',
      //   data: {
      //     action: 'cancel',
      //   },
      // },
    ],
  });

  await actionSheet.present();
}
async openFilterPage() {
  const modal = await this.modalCtrl.create({
    component:RescueFilterComponent,
  });
  modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (role === 'confirm') {
    // this.message = `Hello, ${data}!`;
    this.allRescueParams.filter=data;
    this.getAllRescues();
  }
}
}

import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController, NavParams, SearchbarCustomEvent } from '@ionic/angular';
import { pageAddRescueCityType } from 'src/app/interfaces/pageType';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ToastService } from 'src/app/services/common/toast.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';
export class pageType {
  public static state = "state"
  public static district = "district"
  public static city = "city"
  public static search = "search"
  public static undefined = undefined  
}
@Component({
  selector: 'app-rescue-city',
  templateUrl: './rescue-city.component.html',
  styleUrls: ['./rescue-city.component.scss'],
})
export class RescueCityComponent  implements OnInit {
  city = {
    search: "",
    flag: "1",
    offset: 0,
    state: "",
    district: "",
    city: "",
  };
  SearchPARAMS={
    query:"",offset:0,couldNotFind:false,isSearching:false
  }
  PageType :pageAddRescueCityType=undefined;
  type:pageType=pageType.state;
  SearchCities:{city: string, district: string, state: string, city_id: string}[]=[];
  States:string[]=[];
  districts:string[]=[];
  rescueCities:{city:string,city_id:string}[] =[];
  cities:{city:string,city_id:string}[] =[];
  noRecord=false;
  Loading=true;
  UserId: string="";
  constructor(
    private modalCtrl : ModalController,
    private authService : AuthServiceService,
    private navParams : NavParams,
    private toastCtrl: ToastService,
    private loadingScreen : LoadingScreenService,
  ) { 
    let data:{city:string,city_id:string}[]= this.navParams.get('cities');
    let PageType:pageAddRescueCityType= this.navParams.get('ptype');
    if(data.length > 0)
      {
        this.rescueCities.push(...data);
      }
      if(PageType)
        {
          this.PageType=PageType;
        if(PageType=="edit")  this.UserId = JSON.parse(localStorage.getItem('userData')!).userData.customer_id;
      }
      console.log(this.type)
  }

  ngOnInit() {

    //First Load all States
    this.loadState();
  }
  // checkIfExist(param: {city: string;city_id: string;}) :boolean
  // {
  //   if(this.rescueCities.length==0)
  //   {
  //     console.log("Length 0")
  //     return true
      
  //   }else{
  //     let includes = this.rescueCities.some((city) => city.city_id == param.city)

  //     console.log("Length >0")
  //     if (!includes) {
        
  //       return true
  //     }else{
  //       return false
  //     }
  //   }
  // }
  SelectCity(city:{city_id:string,city:string})
  {
    const cityAdded = this.rescueCities.some((ele) => ele.city_id == city.city_id);
    // console.log(cityAdded);
    
    if(!cityAdded)
      {

        if(this.PageType=="signup"){
          
          
          this.rescueCities.unshift(city);
        }else if(this.PageType==="edit"){
          // 
          this.addCityApi(city);
        }
    }else{
      
    this.toastCtrl.presentToast("<b>city already added</b>","dark",1500,"bottom");
    }
      //  return this.modalCtrl.dismiss(city, 'confirm');
  }

 async addCityApi(data:{city_id:string,city:string}){
    const params= {c_id :this.UserId,city_id:data.city_id};
    const loader = await this.loadingScreen.CreateLoader("Adding",'circular',undefined,"loading-transparent-bg");
   await loader.present();
    this.authService.postData(params,'AddCitiesRescuedEdit').then((res:any)=>{
          
      this.rescueCities.unshift(data);
    // this.displayToast('city added ')
    this.toastCtrl.presentToast("city added","dark",1500,"bottom");

  }).catch((err)=>{
    // this.loadingScreen.dismiss()

      console.error(err)
      this.toastCtrl.presentToast("Oops Something went Wrong","dark",1500,"bottom");
    }).finally(async ()=>{
    await loader.dismiss();
    })
  }
 async removeCityApi(city_id:string){
    const params= {c_id :this.UserId,city_id:city_id};
    const loader = await this.loadingScreen.CreateLoader("Removing",'circular',undefined,"loading-transparent-bg");
   await loader.present();
    this.authService.postData(params,'removeCitiesRescuedEdit').then((res:any)=>{
          
    
    this.rescueCities=this.rescueCities.filter((ele)=>(ele.city_id != city_id) );
    this.toastCtrl.presentToast("<b>city removed</b>","dark",1500,"bottom");

  }).catch((err)=>{
      console.error(err)
      this.toastCtrl.presentToast("Oops Something went Wrong","dark",1500,"bottom");
    }).finally(async ()=>{
    await loader.dismiss();
    })
  }
  removeCity(city_id:string)
  {
    if(this.PageType=="signup"){
      this.rescueCities=this.rescueCities.filter((ele)=>(ele.city_id != city_id) )
      // if(this.rescueCities.length==0){this.addRescue=true}
    }else if(this.PageType==="edit"){
      // 
      if(this.rescueCities.length > 1)
        {
          this.removeCityApi(city_id);
        }else{
          this.toastCtrl.presentToast("Minimum one city required.","dark",1500,"bottom");
        }
    }
  }
  Add(){
     return this.modalCtrl.dismiss(this.rescueCities, 'confirm');
   }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  // Check the Flag
  CheckType(type :pageType, add:string) {
    console.log(add);
    this.type = type;
    
    if (type == pageType.district) {
      this.city.state = add;
      this.getDistrict();
    } else if (type == pageType.city) {
      this.city.district = add;
      this.getCity();
      
    } else {
      console.log("Type not found");
    }
  }
  // STATE
  loadState(infiniteScrollEvent:boolean=false,$event?:InfiniteScrollCustomEvent)
  {
    infiniteScrollEvent? null:this.Loading=true;
    this.city.offset = this.States.length;
    this.authService.postData(this.city, "loadState").then((res: any) => { //param only offset needed
      if (res.searchitems.length > 0 && res.searchitems != 'Null') {
        let a:string[] = [];
        res.searchitems.forEach((arr: {state:string}) => {
          a.push(arr.state);
        });
        console.warn(a);
        this.States.push(...a.sort());
        if(this.noRecord ==true)
        {
          this.noRecord=false;
        }

      }else{
        console.log("State is null")
                this.noRecord = true;
      }
    }).catch((err)=>{
      console.error(err)
    }).finally(()=>{
      this.Loading=false;
      infiniteScrollEvent?$event?.target.complete():null;
    });
  }
// DISTRICT
  getDistrict(infiniteScrollEvent:boolean=false,$event?:InfiniteScrollCustomEvent)
  {
    infiniteScrollEvent? null:this.Loading=true;
    this.city.offset = this.districts.length;
    this.authService.postData(this.city, "loadDistrict").then((res: any) => {
      if (res.searchitems.length > 0 && res.searchitems != 'Null') {
        let a :string[] = [];
        res.searchitems.forEach((arr: {district:string}) => {
          a.push(arr.district);
        });
        this.districts.push(...a.sort());
        if(this.noRecord ==true)
        {
          this.noRecord=false;
        }
      }else{
        console.error("No More District")
        this.noRecord=true;
      }
    }).catch((err)=>{
      console.error(err)
    }).finally(()=>{
      this.Loading=false;
      infiniteScrollEvent?$event?.target.complete():null;
    });
  }
  // CITY
  getCity(infiniteScrollEvent:boolean=false,$event?:InfiniteScrollCustomEvent)
  { 
    infiniteScrollEvent? null:this.Loading=true;
    this.city.offset = this.cities.length;
    this.authService.postData(this.city, "loadCities").then((res: any) => {
    console.log(res);

    if (res.searchitems.length > 0 && res.searchitems != 'Null')
    {
      let a:{city:string,city_id:string}[] = res.searchitems;
      this.cities.push(...a);     
       if(this.noRecord ==true)
      {
        this.noRecord=false;
      }
    }else{
      console.log(" Cities is null")
      this.noRecord = true;
    }
  }).catch((err)=>{
    console.error(err)
  }).finally(()=>{
    this.Loading=false;
    infiniteScrollEvent?$event?.target.complete():null;
  });
  }
  // SearchCity
  getQuery(ev: SearchbarCustomEvent) {
    this.SearchPARAMS.couldNotFind=false
    let val = ev.target.value as string;
    this.cities = [];
    this.districts = [];
    this.States = [];
    this.SearchCities = [];
    this.noRecord = false;
    // this.SearchPARAMS.offset=0
    // this.lastid = "";
    
    if (val && val.trim() != "") {
      val = val.trim();
      this.SearchPARAMS.query = val;
      this.type = "search";
      this.SearchPARAMS.isSearching=true;
      this.srch(this.SearchPARAMS.query);
    } else {
      this.type = "state";
      this.loadState();
    }
  }

  srch(q:string,offset:number=0) {
    let param = {
      search: q,
      off: offset,
    };

    this.authService.postData(param, "searchCity").then(
      (res: any) => {
        if (res.searchitems.length > 0 && res.searchitems != 'Null') {
          this.SearchCities.push(...res.searchitems);
        } else {
          // this.states = [];
          this.SearchCities = [];
          this.SearchPARAMS.couldNotFind=true

        }
        // console.warn('SEARCH OFF : ',this.SearchPARAMS.offset)
      }      
    ).catch((error)=>{console.error(error);
    }).finally(()=>{
      this.SearchPARAMS.isSearching=false;

    });
  }
  doInfinite($event :InfiniteScrollCustomEvent)
   { 
    setTimeout(() => {
        if (this.type == "state") {
          this.loadState(true,$event);
        } else if (this.type == "district") {
          this.getDistrict(true,$event);
        } else if (this.type == "city") {
        this.getCity(true,$event);
        }
        else{
$event.target.complete();
        }
      },1000);
   
  }
}

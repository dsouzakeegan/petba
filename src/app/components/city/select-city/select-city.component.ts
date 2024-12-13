import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController, SearchbarCustomEvent } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';
export class pageType {
  public static state = "state"
  public static district = "district"
  public static city = "city"
  public static search = "search"
  public static undefined = undefined  
}
@Component({
  selector: 'app-select-city',
  templateUrl: './select-city.component.html',
  styleUrls: ['./select-city.component.scss'],
})
export class SelectCityComponent  implements OnInit {
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
  type:pageType=pageType.state;
  SearchCities:{city: string, district: string, state: string, city_id: string}[]=[];
  States:string[]=[];
  districts:string[]=[];
  cities:{city:string,city_id:string}[] =[];
  noRecord=false;
  Loading=true;
  constructor(
    private modalCtrl : ModalController,
    private authService : AuthServiceService,
  ) { 
   
  }

  ngOnInit() {

    //First Load all States
    this.loadState();
  }

  SelectCity(city:{city_id:string,city:string})
  {
       return this.modalCtrl.dismiss(city, 'confirm');
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

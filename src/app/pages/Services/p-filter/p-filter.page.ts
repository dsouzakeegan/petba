import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, RangeCustomEvent, SegmentValue } from '@ionic/angular';
import { User } from 'src/app/interfaces/User';
import { pageProductType } from 'src/app/interfaces/pageType';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';

export interface FilterGroup{
  group_name:string;
  group_id:number;
}
export interface Filter {
  name:string;
  option_id?:string;
  filter_id?:string;
  checked:boolean;
}
export interface PFilter extends FilterGroup{
filters:Filter[]
}

export interface Filters{
  name: string;
  filter_group_id: string;
  filters:FilterOptions[];
}
export interface FilterOptions{
  name: string;
  filter_group_id: string;
  filter_id: string;
}
export interface POptions {
  option_id: string;
  o_name: string;
  filters: POptionFilters[];
}
export interface POptionFilters {
  option_value_id: string;
  name: string;
}
@Component({
  selector: 'app-p-filter',
  templateUrl: './p-filter.page.html',
  styleUrls: ['./p-filter.page.scss'],
})
export class PFilterPage implements OnInit {
  USER:User;
  cate_id:string; 
  RANGE={MIN:0,MAX:5500,STEP:500,MAXLIMIT:5000}
  PRICE :  { lower: number; upper: number }= {lower:0,upper:5500};
  FilterTabSelected! :SegmentValue|undefined;
  PAGE: pageProductType;
filterGroup:FilterGroup[]=[];
filter:PFilter[]=[];
filterSelected:string[]=[];
optionsSelected:string[]=[];
  hasFiltersSelected: boolean=false;

  constructor
  (
     private modalCtrl:ModalController,
     private AuthService:AuthServiceService,
     private loadingScreen:LoadingScreenService,
    private navbParams:NavParams 
     )
     {
      this.USER = JSON.parse(localStorage.getItem("userData")!);
    this.cate_id = this.navbParams.get('category_id');
    this.PAGE = this.navbParams.get('page');
    // console.log("Got param : ",data)
   }

  ngOnInit() {
    // this.getFilters();
    this.checkPage();
  }
  // Pin Styling
 pinFormatter(value: number) { 
   let limit = 5000 ; 
   if(value <= limit){

      return `${value}`;
    }else{
      return `${limit}+`;
    }
  }
  tabChanged(a:SegmentValue|undefined)
  {
    this.FilterTabSelected = a;
    // console.log("tab changed ",this.FilterTabSelected);

  }

  checked($event:any,filterItem :Filter)
  {
    filterItem.checked = $event.detail.checked;
    // console.log($event.detail.checked)
    if(filterItem.checked == true)
    {
      // SELECTED
      if(filterItem.hasOwnProperty('filter_id') && filterItem.filter_id){
        this.filterSelected.push(filterItem.filter_id);
      }
      if(filterItem.hasOwnProperty('option_id') && filterItem.option_id)
      {
        this.optionsSelected.push(filterItem.option_id);

      }

    }else{
      if(filterItem.hasOwnProperty('filter_id') && filterItem.filter_id){
        this.filterSelected= this.filterSelected.filter(item =>(filterItem.filter_id != item));
      }
      if(filterItem.hasOwnProperty('option_id') && filterItem.option_id)
      {
        // this.optionsSelected.push(filterItem.option_id);
        this.optionsSelected=this.optionsSelected.filter(item =>(filterItem.option_id != item));

      }
    }
    if(this.filterSelected.length > 0 || this.optionsSelected.length > 0 )
    {
      this.hasFiltersSelected = true;
    }else{
      this.hasFiltersSelected = false;
      
    }
    console.log(this.filterSelected);
console.log(this.optionsSelected);
  }
  clearFilter()
  {
    this.PRICE={lower:0,upper:5500};
    this.filterSelected = [];
    this.optionsSelected = [];
    // this.filter=[];
    // this.filterGroup=[];
    this.hasFiltersSelected=false;
    this.checkPage();
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
}
apply() {
  let data = {
    price:this.PRICE,
    filters:this.filterSelected,
    options:this.optionsSelected
  }
  return this.modalCtrl.dismiss(data, 'confirm');
}
  getPriceRange(event:Event)
  {
    let rangeValue =((event as RangeCustomEvent).detail.value)as {lower:number ,upper:number};
    if(rangeValue.lower >= rangeValue.upper)
    {

      if(rangeValue.lower >= this.RANGE.MIN+this.RANGE.STEP)
      {
        rangeValue.lower -=this.RANGE.STEP; 
      }else{
        rangeValue.upper+= this.RANGE.STEP;
      }
    }  
    this.PRICE = rangeValue ;
    console.log(this.PRICE) 
  }

  getProductCategory_Filters()
  {
    let param={
      userData:{
        ...this.USER.userData,cate_id:this.cate_id
      }
    }
    
    this.AuthService.postData(param , 'filter').then((result:any)=>{
      // console.log(result);
      let group :FilterGroup[]=[];
      let Filters:PFilter[]=[]


      let filters : Filters[]=result.filter;
      let options : POptions[]=result.option;
      if(filters.length > 0)
      {
        //  this.PFilters= result.filter;
        //  console.log(this.PFilters);

 let New_group :FilterGroup[]=[];
      let New_filters:Filter[]=[]
      let Gid = group.length
New_group = filters.map((GroupItem)=>{
Gid +=1;

   New_filters= GroupItem.filters.map((FilterItem :FilterOptions)=>{
  return{
checked:false,name:FilterItem.name,filter_id:FilterItem.filter_id


   
  }
})
let a :PFilter = {
  filters : New_filters,group_id:Gid,group_name:GroupItem.name
}
Filters.push(a);

 return{
   group_id:Gid,group_name:GroupItem.name

 }
});
group.push(...New_group);

// console.log(group)
// console.log(Filters)
        // let a :Filter[]= filters.map()
         
        }else{
          console.error("NO FILTERS")
        }
        if(options.length > 0)
        {
        
          // this.POptions = options;
          // console.log(this.POptions);


 
          let New_group :FilterGroup[]=[];
          let New_filters:Filter[]=[]
          let Gid = group.length
    New_group = options.map((GroupItem)=>{
    Gid +=1;
    
       New_filters= GroupItem.filters.map((FilterItem )=>{
      return{
    checked:false,name:FilterItem.name,option_id:FilterItem.option_value_id
    
    
       
      }
    })
    let a :PFilter = {
      filters : New_filters,group_id:Gid,group_name:GroupItem.o_name
    }
    Filters.push(a);
    
     return{
       group_id:Gid,group_name:GroupItem.o_name
    
     }
    });
    group.push(...New_group);
    

// console.log(group)
// console.log(Filters)

      }else{
        console.error("NO OPTIONS")
      }

      // DATA MANUPULATIONS
      this.filter = Filters;
      this.filterGroup = group;
      // ADDING ONE MORE FILTER
      let PriceFilter={group_id:0,group_name:"Price"};
      this.filterGroup.push(PriceFilter);
      this.filter.push({filters: [],...PriceFilter});
      
      this.FilterTabSelected = this.filterGroup[0].group_id;
      console.log(group)
console.log(Filters)
 
    }).catch((error)=>{console.error(error)}).finally(()=>{
      this.loadingScreen.dismissLoading();
    })
  }
  checkPage()
  {  this.loadingScreen.presentLoading("",'dots',undefined,"loading-transparent-bg");
    if(this.PAGE=== pageProductType.shop_by_category)
    {
      this.getProductCategory_Filters();
    }
  }
}


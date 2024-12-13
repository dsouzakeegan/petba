import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavParams, SegmentValue } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';

export interface  FilterGroup {
  id: string;
  name: string;
}
export interface  Filters {
  filter_id: string;
  name: string;
  filter_group_id: string;
}
export interface FiltersData{
  FilterGroup: FilterGroup[];
  Filters:Filters[];
}

@Component({
  selector: 'app-s-filter',
  templateUrl: './s-filter.page.html',
  styleUrls: ['./s-filter.page.scss'],
})

export class SFilterPage implements OnInit {
  FilterTabSelected! :SegmentValue|undefined;
  Filters: {
    FGroupOptions:FilterGroup;
    filters: { checked: boolean; filter_id: string; name: string; filter_group_id: string }[];
  }[] = [];
filterParams:string[]=[]
  _TYPE: string;
  hasFilter: boolean=false;
  constructor(
    private modalCtrl: ModalController
    ,private navParams :NavParams
    ,private authService : AuthServiceService
    ,private loadingScreen : LoadingScreenService
    ) {
      this._TYPE = this.navParams.get('type');
      console.log(this._TYPE)
     }

  ngOnInit() {
    this.getFilters();
  }
  getFilters()
  {
    this.loadingScreen.presentLoading("",'dots',undefined,"loading-transparent-bg");
    this.authService.postData({type : this._TYPE},'getFilters').then((res :any )=>{
      if(res.FilterGroup.length > 0){
        let FilterData: {
          FilterGroup:FilterGroup[];
          Filters: { checked: boolean; filter_id: string; name: string; filter_group_id: string }[];
        };
        FilterData=res;
        this.Filters =FilterData.FilterGroup.map((FGroupOptions)=>{
          let filters = FilterData.Filters.filter((FilterOptions)=>(FGroupOptions.id == FilterOptions.filter_group_id)).map((filteredFilterOptions)=>({...filteredFilterOptions,checked:false}));
          return { FGroupOptions,filters}
          
        })
        this.FilterTabSelected=this.Filters[0].FGroupOptions.id
    }
    }).catch((err)=>{
      console.error(err)
    }).finally(()=>{
      this.loadingScreen.dismissLoading();
    })
  }
  tabChanged(a:SegmentValue|undefined)
  {
    this.FilterTabSelected = a;
    // console.log("tab changed ",this.FilterTabSelected);

  }
  checked($event:any,filterItem :{ checked: boolean; filter_id: string; name: string; filter_group_id: string; })
  {
    filterItem.checked = $event.detail.checked;
    if(filterItem.checked)
    {
      this.filterParams.push(filterItem.filter_id);
    }else{
      this.filterParams=this.filterParams.filter((ele)=>(ele != filterItem.filter_id  ));
    }
    this.hasFilter = Object.values(this.filterParams).some((array:any) => array.length > 0);
    // console.log(this.filterParams)
    // console.log($event.detail.checked)
  }
  clear() {
       this.filterParams =[];
       this.hasFilter=false;
       this.Filters=[];
       this.FilterTabSelected=undefined;
       this.getFilters();
   }
  cancel() {
        return this.modalCtrl.dismiss(null, 'cancel');
    }
  confirm() {
      return this.modalCtrl.dismiss(this.filterParams, 'confirm');
  }
   
  // getFilters()
  // {
  //   console.log("getting filters...");
  //   this.Filters =this.FilterData.FilterGroup.map((FGroupOptions)=>{
  //     let filters = this.FilterData.Filters.filter((FilterOptions)=>(FGroupOptions.id == FilterOptions.filter_group_id)).map((filteredFilterOptions)=>({...filteredFilterOptions,checked:false}));
  //     return { FGroupOptions,filters}
      
  //   })
  //   this.FilterTabSelected=this.Filters[0].FGroupOptions.id
  //   console.log(this.Filters);
  // }
 

}


import { Component, OnInit } from '@angular/core';
import { ModalController, SegmentValue } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';

@Component({
  selector: 'app-rescue-filter',
  templateUrl: './rescue-filter.component.html',
  styleUrls: ['./rescue-filter.component.scss'],
})
export class RescueFilterComponent  implements OnInit {
  FilterTabSelected! :SegmentValue|undefined;
  hasFilter:boolean=false;
  FilterParam:any={};
  Filters: {
    FGroupOptions: { id: string; name: string };
    filters: { checked: boolean; filter_id: string; name: string; filter_group_id: string }[];
  }[] = [];

OptionGroups:{id:number|string,OptionGroupName:string}[]=[];
Options:{groupId:number|string,filters:any[],OptionGroupName:string}[]=[];
  constructor(private modalCtrl: ModalController
    ,private authService :AuthServiceService 
    ,private loadingScreen:LoadingScreenService
    ) { }

  ngOnInit() {
    this.getRescueFilters();
  }
  clearFilter(){

    this.getRescueFilters();

  }
  async getRescueFilters()
  {
    await this.loadingScreen.presentLoading("",'dots',undefined,"loading-transparent-bg");
    await this.authService.postData({c_id : ""},"rescueFilters")
    .then((result:any)=>{
      let keys = Object.keys(result);
     let TempOptionGroups:{id:number|string,OptionGroupName:string}[]=[];
     let TempOptions:{groupId:number|string,filters:any[],OptionGroupName:string}[]=[];
      let TempFilters:any = {};
      keys.forEach((key,index) => {
        TempOptionGroups.push({id:index,OptionGroupName:key});
        TempFilters[key]=[];
      TempOptions.push({groupId:index ,filters:result[key],OptionGroupName:key});
      });
      this.OptionGroups=TempOptionGroups;
      this.Options=TempOptions;
      this.FilterTabSelected = this.OptionGroups[0].id;
      this.FilterParam=TempFilters;
    })
    .catch((error)=>{console.error(error)}).finally(()=>{this.loadingScreen.dismissLoading();})
  }
  tabChanged(a:SegmentValue|undefined)
  {
    this.FilterTabSelected = a;

  }
  checked($event:any,option :{ checked: boolean; id: string; name: string; },key:string)
  {
    option.checked = $event.detail.checked;

    if(option.checked === true)
    {
      this.FilterParam[key].push(option.id)
    }else{
      this.FilterParam[key]= this.FilterParam[key].filter((item:any) => item !== option.id);
    }
    this.hasFilter = Object.values(this.FilterParam).some((array:any) => array.length > 0);
  

  }

 cancel() {
      return this.modalCtrl.dismiss(null, 'cancel');
  }
  
  confirm() {
    return this.modalCtrl.dismiss(this.FilterParam, 'confirm');
}
}

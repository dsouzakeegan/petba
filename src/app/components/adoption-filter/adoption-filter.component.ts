import { Component, OnInit } from '@angular/core';
import { ModalController, SegmentValue } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';

@Component({
  selector: 'app-adoption-filter',
  templateUrl: './adoption-filter.component.html',
  styleUrls: ['./adoption-filter.component.scss'],
})
export class AdoptionFilterComponent  implements OnInit {

  FilterTabSelected :SegmentValue;
filterParams={animalTypeName:<any[]>[], breed: <any[]>[], color:<any[]>[], gender: <any[]>[]}
optionsGroups:{ id: string; name: string }[]=[];
  animal: { id: string; name: string;  checked:boolean;}[]=[];
  breed: { id: string; name: string;  checked:boolean;animal_id:any}[]=[];
  breedOptions: { id: string; name: string;  checked:boolean;animal_id:any}[]=[];

  color: {id: string;  name: string; checked:boolean;}[]=[];
  gender: { id: string; name: string ; checked:boolean;}[]=[];
  hasFilter: boolean=false;

  constructor(
    private modalCtrl: ModalController,
    private authService:AuthServiceService,
    private loadingScreen :LoadingScreenService 
    
    ) {
      this.FilterTabSelected ='4';
     }

  ngOnInit() {
    this.getAdoptFilters();
  }
  getAdoptFilters()
  {
    
    this.FilterTabSelected ='4';
    this.getAnimalType();
    this.getColors();
    this.getBreed();
    this.getGender();
  }
  getGender() {
    this.gender=[];
    this.optionsGroups.push({id:'4',name:"Gender"});
   
    this.gender.push({id:'1',name:"Male",checked:false},{id:'2',name:"Female",checked:false});
   
  }
  getAnimalType() {
    this.animal=[];
    this.authService.postData({id:""}, "animalbreed").then((result:any) =>{

      if(result.animalbreed.length > 0){ 
        this.optionsGroups.push({id:'1',name:"Animal Type"});
        var prop= [];
        for (let pro of result.animalbreed){
  
            let animal_id=pro.animal_id;
            let name=pro.name;
            let proc =  {
                          id:animal_id,
                          name:name,
                          checked:false
                        }
            prop.push(proc);        
          }
         this.animal=prop;
      }
    }).catch((err) =>{
      console.error("err: "+err);
    }).finally(()=>{});

  }
  getBreed() {
    this.breed=[];
    this.loadingScreen.presentLoading("",'dots',undefined,"loading-transparent-bg");
    this.authService.postData({id:""}, "breed").then((result:any) =>{
    
      if(result.breed.length > 0){ 
        this.optionsGroups.push({id:'2',name:"Breed"});
        var prop= [];
        for (let pro of result.breed){
            let id=pro.id;
            let name=pro.name;
            let proc =  {
                          id:id,                          
                          name:name,
                          animal_id:pro.animal_id,
                          checked:false
                        }
            prop.push(proc);   
          }
        this.breed=prop;

      }
    }).catch((err) =>{
      console.error("err: "+err);
    }).finally(()=>{ this.loadingScreen.dismissLoading();});
  }
  getColors()
  {
    this.color=[];
    this.authService.postData({id:""}, "color").then((result:any) =>{
      if(result.color.length > 0){ 
        this.optionsGroups.push({id:'3',name:"Colors"});
        var prop= [];
        for (let pro of result.color){
   
            let color=pro.color;
            let id=pro.id;
            let proc =  {
                   name:color,
                   id:id,
                   checked:false
            }
  
            prop.push(proc);        
          }
         this.color=prop; 
      }
    }).catch((err) =>{
      console.error("err: "+err);
    }).finally(()=>{});
    
  }
 
  tabChanged(a:SegmentValue|undefined)
  {
  a ? this.FilterTabSelected = a:null;
    // console.log("tab changed ",this.FilterTabSelected);

  }
  checked($event:any,filterItem :{ id: string; name: string;  checked:boolean;})
  {
    filterItem.checked = $event.detail.checked;
    // console.log(filterItem);
    if(this.FilterTabSelected == 1)
    {
      if(filterItem.checked ==true)
      {
        this.filterParams.animalTypeName.push(filterItem.id);
        
          
      }else{
        this.filterParams.animalTypeName=  this.filterParams.animalTypeName.filter((item)=>(item !== filterItem.id));
       
      }
    }else if(this.FilterTabSelected == 2)
    {
      if(filterItem.checked ==true)
      {
        this.filterParams.breed.push(filterItem.id);
      
      }else{
        this.filterParams.breed=  this.filterParams.breed.filter((item)=>(item !== filterItem.id));
      }
    }else if(this.FilterTabSelected == 3)
    {
      if(filterItem.checked ==true)
      {
        this.filterParams.color.push(filterItem.id);
      
      }else{
        this.filterParams.color=  this.filterParams.color.filter((item)=>(item !== filterItem.id));
      }
    }else if(this.FilterTabSelected == 4)
    {
      if(filterItem.checked ==true)
      {
        this.filterParams.gender.push(filterItem.id);
      
      }else{
        this.filterParams.gender=  this.filterParams.gender.filter((item)=>(item !== filterItem.id));
      }
    }
    this.hasFilter = Object.values(this.filterParams).some((array:any) => array.length > 0);
    // console.log(this.filterParams);
    // console.log($event.detail.checked)
  }

 cancel() {
      return this.modalCtrl.dismiss(null, 'cancel');
  }
  
  confirm() {
    console.log(this.filterParams)
    return this.modalCtrl.dismiss(this.filterParams, 'confirm');
}
clear()
{
  this.hasFilter=false;
  this.optionsGroups=[];
  this.getAdoptFilters();
}
}

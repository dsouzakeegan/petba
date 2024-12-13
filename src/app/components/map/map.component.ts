import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { CameraConfig } from '@capacitor/google-maps/dist/typings/definitions';
import { environment } from 'src/environments/environment';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { Position } from '@capacitor/geolocation';


const apiKey = environment.MAPKEY;

@Component({
  selector: 'app-map', 
  template: `<div class="container">
  <capacitor-google-map #map></capacitor-google-map>
  <ion-button *ngIf="editable" (click)="getCurrentLocation()" class="locate-btn">
    <ion-icon name="locate" slot="icon-only"></ion-icon>
  </ion-button>
</div>`,
  // templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent  implements OnInit {
  @ViewChild ('map') mapRef!: ElementRef<HTMLElement>; //MAP Reference

  // OUTPUT
  @Output () coords =new EventEmitter<{lng:number,lat:number}>(); 

  //INPUT 
  @Input ()editable :boolean=false;
  @Input ()LAT :number=15.2993; 
  @Input ()LNG :number=74.1240; 

  // VARIABLES
  map!: GoogleMap;
  MARKER:any ;
  constructor(
    private geoLocation: GeolocationService,
  ) { }

  ngAfterViewInit  ()
  {
    this.createMap(this.LAT,this.LNG);
    this.outPut(this.LAT,this.LNG);
    // document.body.style.background = 'none';
    
  }
  ngOnInit() {

  } 
  // CREATE & INTIALIZE MAP /* Need to Intialize Once */
  async createMap(latitude:number,longitutde:number) {
    this.map = await GoogleMap.create({
      id: 'my-map',
      element: this.mapRef.nativeElement,
      apiKey: apiKey,
      forceCreate:true,
      config: {
        center: {
          lat: latitude,
          lng: longitutde,
        },
        zoom: 8,
      },
    });

  
    //ADD A MARKER ON MAP
    this.addMarkers(latitude,longitutde);
  }
    // ADD MARKER
  async addMarkers(latitude:number,longitutde:number)
  {
    const Marker:Marker = {
      coordinate:{
        lat:latitude,
        lng:longitutde
      },
      draggable:this.editable ? true : false,
      title:"Rescue pet here"
      ,snippet:"Hold & Drag to move the marker"

    }
    // GET ID OF THE  MARKER FOR FURTHER CHANGES FOR THE MARKER
    this.MARKER  = this.map.addMarker(Marker); 


    // IF EDITABLE >>> ADD LISTENERS
    if(this.editable){
      // GET THE LOCATION OF MARKER PLACED WHEN  **DRAGGED** 
      this.map.setOnMarkerDragEndListener(async(marker)=>{
        console.log("Marker Dragged")
        console.log(marker)
        // SET LAT & LNG TO OUTPUT
        this.outPut(marker.latitude,marker.longitude);
      });
      
      
      // GET THE LOCATION OF CLICKED PLACED WHEN  **CLICKED ON MAP**  
      this.map.setOnMapClickListener(async(clicked)=>{
        console.log("Clicked On Map")
        console.log(clicked)
  
        // SET LAT & LNG TO OUTPUT
        this.outPut(clicked.latitude,clicked.longitude);
  
        // SET MARKER FOR THE CLICKED LOCATION
        this.setMarker(clicked.latitude,clicked.longitude);
      })
    }
    
  }

  // SET THE MARKER 
 async setMarker(latitude:number,longitude:number)
  {
 //DELETE MARKER  IF EXISTS
 if(this.MARKER )
 {
   await this.map.removeMarker(this.MARKER.__zone_symbol__value);
 }
 // ADD MARKER
 await this.addMarkers(latitude,longitude);
  }
  // CHANGE THE CAMERA VIEW OF THE MAP 
  async changeCamera(latitude:number,longitude:number,zoom:number=8,animate:boolean=false)
  {
    const camerConfig:CameraConfig={
      coordinate:{
        lat:latitude,
        lng:longitude
      }
      ,zoom:zoom,
      animate:animate
    }
    await this.map.setCamera(camerConfig);
  }

  // CHANGE  LOCATION 
  async changeLocation(latitude:number,longitude:number)
  {
console.log(this.MARKER)
// Set Marker To New Location
this.setMarker(latitude,longitude); 
// Set Camera To New Location 
this.changeCamera(latitude,longitude,8,true);

// SET LAT & LNG TO OUTPUT
this.outPut(latitude,longitude);
  }

  async getCurrentLocation()
  {
      // Get Location Latitude And Longitude
  const {location , status} = await this.geoLocation.getCurrentLocation();
  if (status === 200) {
    let latitude=(location as Position).coords.latitude;
    let longitude=(location as Position).coords.longitude; 
        
      //CHANGE THE VIEW TO CURRENT LOCATION
      await this.changeLocation(latitude,longitude);

      console.log("changed Location...")
   

  }
  }

  // SET TO RETURN THE VALUE TO VIEW 
  outPut(lat:number,lng:number)
  {
    let Position={
      lat,lng
    }
    this.coords.emit(Position);

  }
  
}

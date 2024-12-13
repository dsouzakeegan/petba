import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { MapComponent } from "./map.component";


@NgModule({
declarations:[MapComponent],
imports: [CommonModule,IonicModule],
exports:[MapComponent],
schemas:[CUSTOM_ELEMENTS_SCHEMA]

})  
export class mapModule{}

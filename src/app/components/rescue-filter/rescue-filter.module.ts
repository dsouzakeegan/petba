import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { RescueFilterComponent } from "./rescue-filter.component";

@NgModule({
    declarations:[RescueFilterComponent],
    imports:[CommonModule,IonicModule],
    exports:[RescueFilterComponent],
    
})
export class rescueFilterModule{}
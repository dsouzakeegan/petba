import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { AdoptionFilterComponent } from "./adoption-filter.component";

@NgModule({
    declarations:[AdoptionFilterComponent],
    imports:[CommonModule,IonicModule],
    exports:[AdoptionFilterComponent],
    
})
export class adoptionFilterModule{}
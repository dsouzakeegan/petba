import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { RescueCityComponent } from "./rescue-city.component";

@NgModule({
    declarations:[RescueCityComponent],
    imports:[CommonModule,IonicModule],
    exports:[RescueCityComponent],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class rescueCityModule{}
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { SelectCityComponent } from "./select-city.component";

@NgModule({
    declarations:[SelectCityComponent],
    imports:[CommonModule,IonicModule],
    exports:[SelectCityComponent],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class selectCityModule{}
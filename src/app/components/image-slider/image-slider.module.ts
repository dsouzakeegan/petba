import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { ImageSliderComponent } from "./image-slider.component";


@NgModule({
declarations:[ImageSliderComponent],
imports: [CommonModule,IonicModule],
exports:[ImageSliderComponent],
schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class ImageSliderModule{}

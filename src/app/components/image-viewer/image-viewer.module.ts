import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { ImageViewerComponent } from "./image-viewer.component";


@NgModule({
declarations:[ImageViewerComponent],
imports: [CommonModule,IonicModule],
exports:[ImageViewerComponent],
schemas:[CUSTOM_ELEMENTS_SCHEMA]

})  
export class ImageViewModule{}

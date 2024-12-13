import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { BannerComponent } from "./banner.component";

@NgModule({
    declarations:[BannerComponent],
    imports:[CommonModule,IonicModule],
    exports:[BannerComponent],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class bannerModule{}
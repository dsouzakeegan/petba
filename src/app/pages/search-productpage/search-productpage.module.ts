import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchProductpagePageRoutingModule } from './search-productpage-routing.module';

import { SearchProductpagePage } from './search-productpage.page';
import { SearchProductresultsComponent } from 'src/app/components/search-productresults/search-productresults.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchProductpagePageRoutingModule
  ],
  declarations: [SearchProductpagePage,SearchProductresultsComponent]
})
export class SearchProductpagePageModule {}

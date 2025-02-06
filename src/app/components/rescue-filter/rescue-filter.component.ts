import { Component, OnInit } from '@angular/core';
import { ModalController, SegmentValue } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';

@Component({
  selector: 'app-rescue-filter',
  templateUrl: './rescue-filter.component.html',
  styleUrls: ['./rescue-filter.component.scss'],
})
export class RescueFilterComponent implements OnInit {
  FilterTabSelected!: SegmentValue | undefined;
  hasFilter: boolean = false;
  FilterParam: Record<string, any[]> = {}; // Fixed type declaration.
  Filters: {
    FGroupOptions: { id: string; name: string };
    filters: { checked: boolean; filter_id: string; name: string; filter_group_id: string }[];
  }[] = [];

  OptionGroups: { id: number | string; OptionGroupName: string }[] = [];
  Options: { groupId: number | string; filters: any[]; OptionGroupName: string }[] = [];

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthServiceService,
    private loadingScreen: LoadingScreenService
  ) {}

  ngOnInit() {
    this.getRescueFilters();
  }

  clearFilter() {
    this.getRescueFilters();
  }

  async getRescueFilters() {
    await this.loadingScreen.presentLoading('', 'dots', undefined, 'loading-transparent-bg');
  
    try {
      // Use a type assertion to inform TypeScript about the expected structure
      const rawResult = await this.authService.postData({ c_id: null }, 'rescueFilter');
      const result = rawResult as Record<string, any[]>;
  
      // Validate the structure (optional but recommended)
      if (typeof result !== 'object' || result === null) {
        throw new Error('Invalid response format');
      }
  
      const keys = Object.keys(result);
      const TempOptionGroups: { id: number | string; OptionGroupName: string }[] = [];
      const TempOptions: { groupId: number | string; filters: any[]; OptionGroupName: string }[] = [];
      const TempFilters: Record<string, any[]> = {};
  
      keys.forEach((key, index) => {
        TempOptionGroups.push({ id: index, OptionGroupName: key });
        TempFilters[key] = []; // Initialize with an empty array
        TempOptions.push({ groupId: index, filters: result[key], OptionGroupName: key });
      });
  
      this.OptionGroups = TempOptionGroups;
      this.Options = TempOptions;
      this.FilterTabSelected = this.OptionGroups[0]?.id;
      this.FilterParam = TempFilters;
  
    } catch (error : any) {
      console.error('Error fetching rescue filters:', error.message);
    } finally {
      this.loadingScreen.dismissLoading();
    }
  }
  

  tabChanged(a: SegmentValue | undefined) {
    this.FilterTabSelected = a;
  }

  checked($event: any, option: { checked: boolean; id: string; name: string }, key: string) {
    option.checked = $event.detail.checked;

    if (option.checked === true) {
      this.FilterParam[key].push(option.id); // Correct type ensures no error here.
    } else {
      this.FilterParam[key] = this.FilterParam[key].filter((item: any) => item !== option.id);
    }
    this.hasFilter = Object.values(this.FilterParam).some((array: any) => array.length > 0);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.FilterParam, 'confirm');
  }
}

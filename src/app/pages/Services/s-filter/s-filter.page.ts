import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, SegmentValue } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';

export interface FilterGroup {
  id: string;
  name: string;
}
export interface Filters {
  filter_id: string;
  name: string;
  filter_group_id: string;
}
export interface FiltersData {
  FilterGroup: FilterGroup[];
  Filters: Filters[];
}

@Component({
  selector: 'app-s-filter',
  templateUrl: './s-filter.page.html',
  styleUrls: ['./s-filter.page.scss'],
})
export class SFilterPage implements OnInit {
  FilterTabSelected!: SegmentValue | undefined;
  Filters: {
    FGroupOptions: FilterGroup;
    filters: { checked: boolean; filter_id: string; name: string; filter_group_id: string }[];
  }[] = [];
  filterParams: string[] = [];
  _TYPE: string;
  hasFilter: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private authService: AuthServiceService,
    private loadingScreen: LoadingScreenService
  ) {
    this._TYPE = this.navParams.get('type');
    console.log('Type:', this._TYPE);
  }

  ngOnInit() {
    this.getFilters();
  }

  getFilters() {
    this.loadingScreen.presentLoading('', 'dots', undefined, 'loading-transparent-bg');
    this.authService
      .postData({ type: this._TYPE }, 'getFilters')
      .then((res: any) => {
        console.log('API Response:', res);

        // Validate FilterGroup in the response
        if (res && Array.isArray(res.FilterGroup) && res.FilterGroup.length > 0) {
          const FilterData: FiltersData = {
            FilterGroup: res.FilterGroup,
            Filters: res.Filters || [], // Default Filters to an empty array if missing
          };

          this.Filters = FilterData.FilterGroup.map((FGroupOptions) => {
            const filters = FilterData.Filters.filter(
              (FilterOptions) => FGroupOptions.id === FilterOptions.filter_group_id
            ).map((filteredFilterOptions) => ({ ...filteredFilterOptions, checked: false }));
            return { FGroupOptions, filters };
          });

          this.FilterTabSelected = this.Filters[0]?.FGroupOptions.id || undefined;
        } else {
          // Handle empty or undefined FilterGroup
          console.warn('FilterGroup is empty or undefined.');
          this.Filters = [];
          this.FilterTabSelected = undefined;
        }
      })
      .catch((err) => {
        console.error('Error fetching filters:', err);
      })
      .finally(() => {
        this.loadingScreen.dismissLoading();
      });
  }

  tabChanged(a: SegmentValue | undefined) {
    this.FilterTabSelected = a;
  }

  checked($event: any, filterItem: { checked: boolean; filter_id: string; name: string; filter_group_id: string }) {
    filterItem.checked = $event.detail.checked;
    if (filterItem.checked) {
      this.filterParams.push(filterItem.filter_id);
    } else {
      this.filterParams = this.filterParams.filter((ele) => ele !== filterItem.filter_id);
    }
    this.hasFilter = this.filterParams.length > 0;
  }

  clear() {
    this.filterParams = [];
    this.hasFilter = false;
    this.Filters = [];
    this.FilterTabSelected = undefined;
    this.getFilters();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.filterParams, 'confirm');
  }
}

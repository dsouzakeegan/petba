import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, RangeCustomEvent, SegmentValue } from '@ionic/angular';
import { User } from 'src/app/interfaces/User';
import { pageProductType } from 'src/app/interfaces/pageType';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';

export interface FilterGroup {
  group_name: string;
  group_id: number;
}
export interface Filter {
  name: string;
  option_id?: string;
  filter_id?: string;
  checked: boolean;
}
export interface PFilter extends FilterGroup {
  filters: Filter[];
}

export interface Filters {
  name: string;
  filter_group_id: string;
  filters: FilterOptions[];
}
export interface FilterOptions {
  name: string;
  filter_group_id: string;
  filter_id: string;
}
export interface POptions {
  option_id: string;
  o_name: string;
  filters: POptionFilters[];
}
export interface POptionFilters {
  option_value_id: string;
  name: string;
}

@Component({
  selector: 'app-p-filter',
  templateUrl: './p-filter.page.html',
  styleUrls: ['./p-filter.page.scss'],
})
export class PFilterPage implements OnInit {
  USER: User;
  cate_id: string;
  RANGE = { MIN: 0, MAX: 5500, STEP: 500, MAXLIMIT: 5000 };
  PRICE: { lower: number; upper: number } = { lower: 0, upper: 5500 };
  FilterTabSelected!: SegmentValue | undefined;
  PAGE: pageProductType;
  filterGroup: FilterGroup[] = [];
  filter: PFilter[] = [];
  filterSelected: string[] = [];
  optionsSelected: string[] = [];
  hasFiltersSelected: boolean = false;
  customer_id: string;
  email: string;
  token: string;

  constructor(
    private modalCtrl: ModalController,
    private AuthService: AuthServiceService,
    private loadingScreen: LoadingScreenService,
    private navbParams: NavParams
  ) {
    this.USER = JSON.parse(localStorage.getItem('userData')!);
    this.cate_id = this.navbParams.get('category_id') || '';
    this.PAGE = this.navbParams.get('page');
    console.log('Category ID:', this.cate_id);
    this.customer_id = this.navbParams.get('customer_id') ?? '';  // Set default or empty value
    this.email = this.navbParams.get('email') ?? '';         // Set default or empty value
    this.token = this.navbParams.get('token') ?? '';         // Set default or empty value
  }

  ngOnInit() {
    if (!this.cate_id) {
      console.error('Category ID is missing or invalid. Please provide a valid category ID.');
      return;
    }
    this.checkPage();
  }

  pinFormatter(value: number) {
    let limit = 5000;
    return value <= limit ? `${value}` : `${limit}+`;
  }

  tabChanged(a: SegmentValue | undefined) {
    this.FilterTabSelected = a;
  }

  checked($event: any, filterItem: Filter) {
    filterItem.checked = $event.detail.checked;
    if (filterItem.checked) {
      if (filterItem.filter_id) this.filterSelected.push(filterItem.filter_id);
      if (filterItem.option_id) this.optionsSelected.push(filterItem.option_id);
    } else {
      if (filterItem.filter_id) {
        this.filterSelected = this.filterSelected.filter(item => filterItem.filter_id !== item);
      }
      if (filterItem.option_id) {
        this.optionsSelected = this.optionsSelected.filter(item => filterItem.option_id !== item);
      }
    }
    this.hasFiltersSelected = this.filterSelected.length > 0 || this.optionsSelected.length > 0;
  }

  clearFilter() {
    this.PRICE = { lower: 0, upper: 5500 };
    this.filterSelected = [];
    this.optionsSelected = [];
    this.hasFiltersSelected = false;
    this.checkPage();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  apply() {
    const data = {
      price: this.PRICE,
      filters: this.filterSelected,
      options: this.optionsSelected,
    };
    return this.modalCtrl.dismiss(data, 'confirm');
  }

  getPriceRange(event: Event) {
    const rangeValue = (event as RangeCustomEvent).detail.value as { lower: number; upper: number };
    if (rangeValue.lower >= rangeValue.upper) {
      if (rangeValue.lower >= this.RANGE.MIN + this.RANGE.STEP) {
        rangeValue.lower -= this.RANGE.STEP;
      } else {
        rangeValue.upper += this.RANGE.STEP;
      }
    }
    this.PRICE = rangeValue;
  }

  getProductCategory_Filters() {
    // Retrieve user data dynamically from localStorage
    const userData = JSON.parse(localStorage.getItem('userData')!); // Assuming userData is stored in localStorage

    // Ensure user data exists before proceeding
    if (!userData || !userData.customer_id || !userData.email || !userData.token) {
      console.error('User data is missing. Ensure the user is logged in and the data is available.');
      return;
    }

    // Retrieve category id dynamically from navigation params
    const cate_id = this.navbParams.get('category_id') || '';  // Can be passed from other pages

    const param = {
      userData: {
        customer_id: userData.customer_id,   // Dynamically fetch customer_id
        email: userData.email,               // Dynamically fetch email
        token: userData.token,               // Dynamically fetch token
        cate_id: cate_id || 'default_category',  // Fallback category_id if not passed
      },
    };
    
    console.log('API Request Parameters:', param);

    this.AuthService.postData(param, 'filter')
      .then((result: any) => {
        console.log('Full API Response:', result);

        // Check if the response is valid and has the expected structure
        if (!result || !result.filter || !result.option) {
          console.error('Invalid response format', result);
          return;
        }

        const filters: Filters[] = Array.isArray(result.filter) ? result.filter : [];
        const options: POptions[] = Array.isArray(result.option) ? result.option : [];

        // if (filters.length === 0) {
        //   console.warn('Filters are empty. No filters to display.');
        // }
        // if (options.length === 0) {
        //   console.warn('Options are empty. No options to display.');
        // }

        const group: FilterGroup[] = [];
        const Filters: PFilter[] = [];

        filters.forEach(GroupItem => {
          const newFilters: Filter[] = GroupItem.filters.map(FilterItem => ({
            checked: false,
            name: FilterItem.name,
            filter_id: FilterItem.filter_id,
          }));
          const newGroup: FilterGroup = { group_id: group.length + 1, group_name: GroupItem.name };
          Filters.push({ filters: newFilters, ...newGroup });
          group.push(newGroup);
        });

        options.forEach(GroupItem => {
          const newFilters: Filter[] = GroupItem.filters.map(FilterItem => ({
            checked: false,
            name: FilterItem.name,
            option_id: FilterItem.option_value_id,
          }));
          const newGroup: FilterGroup = { group_id: group.length + 1, group_name: GroupItem.o_name };
          Filters.push({ filters: newFilters, ...newGroup });
          group.push(newGroup);
        });

        this.filter = Filters;
        this.filterGroup = group;
        // console.log(this.filter);
        // console.log(this.filterGroup);

        const priceFilter = { group_id: 0, group_name: 'Price' };
        this.filterGroup.push(priceFilter);
        this.filter.push({ filters: [], ...priceFilter });
        console.log("Price Filter: ", priceFilter);

        this.FilterTabSelected = this.filterGroup[0]?.group_id;
      })
      .catch(error => console.error('API Call Error:', error))
      .finally(() => {
        this.loadingScreen.dismissLoading();
      });
  }

  checkPage() {
    this.loadingScreen.presentLoading('', 'dots', undefined, 'loading-transparent-bg');
    if (this.PAGE === pageProductType.shop_by_category) {
      this.getProductCategory_Filters();
    }
  }
}

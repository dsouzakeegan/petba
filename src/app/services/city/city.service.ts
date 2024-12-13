import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private citySource = new BehaviorSubject<{ city_id: string, city: string }>(this.getSavedCity());
  currentCity = this.citySource.asObservable();

  constructor() { }

  changeCity(city: { city_id: string, city: string }) {
    this.citySource.next(city);
    localStorage.setItem('_location', JSON.stringify(city));  // Optionally store in local storage
  }

  getSavedCity() {
    const savedCity = localStorage.getItem('_location');
    return savedCity ? JSON.parse(savedCity) : { city_id: '', city: '' };
  }
}

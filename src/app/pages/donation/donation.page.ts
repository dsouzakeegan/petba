import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.page.html',
  styleUrls: ['./donation.page.scss'],
})
export class DonationPage implements OnInit  {
  
  presetAmountToggle: boolean = true; // Default to preset amount toggle
  selectedPresetAmount: number = 50; // Default preset amount
  customAmount: number | undefined; // Custom amount input

  constructor( private router: Router) { }

  ngOnInit() {
  }
  donate(amount: number | undefined) {
    if (amount !== undefined) {
      console.log("Donating: $" + amount);
      // Add your donation logic here

      // Navigate to the personaldetails page and pass the donation amount as state
      this.router.navigate(['/personaldetails'], { state: { donationAmount: amount } });
    } else {
      console.error("Invalid donation amount.");
    }
  }
  
}

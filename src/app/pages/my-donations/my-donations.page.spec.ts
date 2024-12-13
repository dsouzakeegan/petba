import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyDonationsPage } from './my-donations.page';

describe('MyDonationsPage', () => {
  let component: MyDonationsPage;
  let fixture: ComponentFixture<MyDonationsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyDonationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllServicesPage } from './all-services.page';

describe('AllServicesPage', () => {
  let component: AllServicesPage;
  let fixture: ComponentFixture<AllServicesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AllServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

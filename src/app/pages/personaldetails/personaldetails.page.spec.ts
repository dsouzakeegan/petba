import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonaldetailsPage } from './personaldetails.page';

describe('PersonaldetailsPage', () => {
  let component: PersonaldetailsPage;
  let fixture: ComponentFixture<PersonaldetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PersonaldetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SFilterPage } from './s-filter.page';

describe('SFilterPage', () => {
  let component: SFilterPage;
  let fixture: ComponentFixture<SFilterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

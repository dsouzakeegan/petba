import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RescuepetPage } from './rescuepet.page';

describe('RescuepetPage', () => {
  let component: RescuepetPage;
  let fixture: ComponentFixture<RescuepetPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RescuepetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

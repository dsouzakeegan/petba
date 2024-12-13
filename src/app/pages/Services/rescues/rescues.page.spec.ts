import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RescuesPage } from './rescues.page';

describe('RescuesPage', () => {
  let component: RescuesPage;
  let fixture: ComponentFixture<RescuesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RescuesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

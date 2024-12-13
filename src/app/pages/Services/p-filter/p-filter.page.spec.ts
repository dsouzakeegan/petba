import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PFilterPage } from './p-filter.page';

describe('PFilterPage', () => {
  let component: PFilterPage;
  let fixture: ComponentFixture<PFilterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopByCategoryPage } from './shop-by-category.page';

describe('ShopByCategoryPage', () => {
  let component: ShopByCategoryPage;
  let fixture: ComponentFixture<ShopByCategoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShopByCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

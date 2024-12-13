import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductWishlistPage } from './product-wishlist.page';

describe('ProductWishlistPage', () => {
  let component: ProductWishlistPage;
  let fixture: ComponentFixture<ProductWishlistPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProductWishlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPetsPage } from './my-pets.page';

describe('MyPetsPage', () => {
  let component: MyPetsPage;
  let fixture: ComponentFixture<MyPetsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyPetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

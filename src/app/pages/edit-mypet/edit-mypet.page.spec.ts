import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditMypetPage } from './edit-mypet.page';

describe('EditMypetPage', () => {
  let component: EditMypetPage;
  let fixture: ComponentFixture<EditMypetPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditMypetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

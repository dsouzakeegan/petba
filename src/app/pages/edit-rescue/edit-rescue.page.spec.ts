import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditRescuePage } from './edit-rescue.page';

describe('EditRescuePage', () => {
  let component: EditRescuePage;
  let fixture: ComponentFixture<EditRescuePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditRescuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

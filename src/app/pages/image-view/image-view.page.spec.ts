import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageViewPage } from './image-view.page';

describe('ImageViewPage', () => {
  let component: ImageViewPage;
  let fixture: ComponentFixture<ImageViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ImageViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchProductpagePage } from './search-productpage.page';

describe('SearchProductpagePage', () => {
  let component: SearchProductpagePage;
  let fixture: ComponentFixture<SearchProductpagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SearchProductpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

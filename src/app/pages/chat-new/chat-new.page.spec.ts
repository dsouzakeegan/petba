import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatNewPage } from './chat-new.page';

describe('ChatNewPage', () => {
  let component: ChatNewPage;
  let fixture: ComponentFixture<ChatNewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChatNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

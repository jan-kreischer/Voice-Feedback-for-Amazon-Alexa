import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackRepliesComponent } from './feedback-replies.component';

describe('FeedbackRepliesComponent', () => {
  let component: FeedbackRepliesComponent;
  let fixture: ComponentFixture<FeedbackRepliesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackRepliesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackRepliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackOverviewComponent } from './feedback-overview.component';

describe('FeedbackOverviewComponent', () => {
  let component: FeedbackOverviewComponent;
  let fixture: ComponentFixture<FeedbackOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

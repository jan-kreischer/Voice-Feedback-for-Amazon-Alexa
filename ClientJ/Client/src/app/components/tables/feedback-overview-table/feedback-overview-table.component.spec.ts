import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackOverviewTableComponent } from './feedback-overview-table.component';

describe('FeedbackOverviewTableComponent', () => {
  let component: FeedbackOverviewTableComponent;
  let fixture: ComponentFixture<FeedbackOverviewTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackOverviewTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackOverviewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

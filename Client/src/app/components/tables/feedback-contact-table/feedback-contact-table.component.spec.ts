import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackContactTableComponent } from './feedback-contact-table.component';

describe('FeedbackContactTableComponent', () => {
  let component: FeedbackContactTableComponent;
  let fixture: ComponentFixture<FeedbackContactTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackContactTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackContactTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

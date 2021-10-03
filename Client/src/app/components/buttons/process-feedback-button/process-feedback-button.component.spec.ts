import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessFeedbackButtonComponent } from './process-feedback-button.component';

describe('ProcessFeedbackButtonComponent', () => {
  let component: ProcessFeedbackButtonComponent;
  let fixture: ComponentFixture<ProcessFeedbackButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessFeedbackButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessFeedbackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

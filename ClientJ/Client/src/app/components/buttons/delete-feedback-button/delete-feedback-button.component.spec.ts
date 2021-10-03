import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFeedbackButtonComponent } from './delete-feedback-button.component';

describe('DeleteFeedbackButtonComponent', () => {
  let component: DeleteFeedbackButtonComponent;
  let fixture: ComponentFixture<DeleteFeedbackButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteFeedbackButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFeedbackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

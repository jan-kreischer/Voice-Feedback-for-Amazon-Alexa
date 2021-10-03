import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {  ChangeDetectorRef } from '@angular/core';
import { Feedback } from '../../../models/feedback';
import { FeedbackService } from '../../../services/feedback.service';

@Component({
  selector: 'app-process-feedback-button',
  templateUrl: './process-feedback-button.component.html',
  styleUrls: ['./process-feedback-button.component.scss']
})

export class ProcessFeedbackButtonComponent implements OnInit {
  @Input() feedback: Feedback;
  
  markFeedbackAsProcessed(feedback_id: number){
    this.feedbackService.markFeedbackAsProcessed(feedback_id).subscribe((data) =>{
      this.feedback = data[0];
      this.cdr.detectChanges();
    });
  }
  
  constructor(private feedbackService: FeedbackService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

}
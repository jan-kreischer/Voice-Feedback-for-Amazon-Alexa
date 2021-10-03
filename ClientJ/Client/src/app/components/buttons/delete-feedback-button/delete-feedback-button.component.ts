import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Feedback } from '../../../models/feedback';
import { FeedbackService } from '../../../services/feedback.service';

@Component({
  selector: 'app-delete-feedback-button',
  templateUrl: './delete-feedback-button.component.html',
  styleUrls: ['./delete-feedback-button.component.scss']
})

export class DeleteFeedbackButtonComponent implements OnInit {
  @Input() feedback: Feedback;
  
  deleteFeedback(feedback_id: number){
    this.feedbackService.deleteFeedback(feedback_id).subscribe((data) =>{
      this.feedback = data[0];
      this.location.back();
    });
  }
  constructor(private feedbackService: FeedbackService, private location: Location) { }

  ngOnInit() { }

}
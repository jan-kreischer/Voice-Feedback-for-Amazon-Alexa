import { Component, OnInit } from '@angular/core';
import { Feedback } from '../../../models/feedback'
import { FeedbackType } from '../../../models/feedback-types'
import { FeedbackService } from '../../../services/feedback.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss']
})

export class FeedbacksComponent implements OnInit {
  feedbacks: Feedback[]
  feedback_types: FeedbackType[] = [
    { feedback_type_id: 1, feedback_type_name: 'Bug Reports' },
    { feedback_type_id: 2, feedback_type_name: 'Feature Requests' },
    { feedback_type_id: 3, feedback_type_name: 'Questions' },
    { feedback_type_id: 4, feedback_type_name: 'Praises' },
  ];
  
  constructor(private feedbackService: FeedbackService) {
  }
  
  deleteFeedback(feedback_id){
    this.feedbackService.deleteFeedback(feedback_id).subscribe((data)=>{});
  }
  
  markFeedbackAsProcessed(){}
  
  getFeedbacks(): void {
    this.feedbackService.getFeedbacks().subscribe((data: Feedback[]) => this.feedbacks = data);
  }

  ngOnInit() {
    this.getFeedbacks();
  }
}

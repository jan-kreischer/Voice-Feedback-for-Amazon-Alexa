import { Component, OnInit } from '@angular/core';
import { Feedback } from '../../../models/feedback'
import { Reply } from '../../../models/reply'
import { FeedbackService } from '../../../services/feedback.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
  
export class FeedbackComponent implements OnInit {
  feedback: Feedback
  replies: Reply[]
  replyForm;
  
  constructor
  (    
    private route: ActivatedRoute,
    private feedbackService: FeedbackService,
    private formBuilder: FormBuilder,
  ) 
  { 
    this.replyForm= this.formBuilder.group({
      reply_content: '',
      address: ''
    });
  }

  getFeedback(): void {
    const feedback_id = +this.route.snapshot.paramMap.get('feedback_id');
    this.feedbackService.getFeedback(feedback_id).subscribe((data: Feedback[]) => this.feedback = data[0]);
  }
  
  getReplies(): void {
    const feedback_id = +this.route.snapshot.paramMap.get('feedback_id');
    this.feedbackService.getReplies(feedback_id).subscribe((data: Reply[]) => {this.replies = data; console.log(this.replies)});
  }
  
  ngOnInit() {
    this.getFeedback()
  }
  
  onReply(reply) {
    console.warn('Your order has been submitted', reply);
  }
}

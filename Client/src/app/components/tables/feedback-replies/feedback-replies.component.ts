import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { Feedback } from '../../../models/feedback';
import { Reply } from '../../../models/reply';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FeedbackService } from '../../../services/feedback.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feedback-replies',
  templateUrl: './feedback-replies.component.html',
  styleUrls: ['./feedback-replies.component.scss']
})
export class FeedbackRepliesComponent implements OnInit {
  @Input() feedback: Feedback;
  reply_form;
  //replyContentControl = new FormControl('');
  submitted = false;
  reply_content;
  reply = new Reply(1, "");
  
  constructor(private route: ActivatedRoute, private feedbackService: FeedbackService, private formBuilder: FormBuilder) { 
    
    this.reply_form= this.formBuilder.group({
      reply_content: '',
    });
  }
  


  async onSubmit() { 
    this.submitted = true;
    await this.feedbackService.postReply(this.feedback.feedback_id, this.reply.reply_content).subscribe((data) =>{
      console.log(data);
      window.location.reload();
    });
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.reply); }
  
  clickedReplyButton() {
    console.log(this.reply_content);
  }

  ngOnInit() {
  }

}

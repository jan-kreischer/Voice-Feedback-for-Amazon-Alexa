import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Feedback } from '../../../models/feedback'

@Component({
  selector: 'app-feedback-contact-table',
  templateUrl: './feedback-contact-table.component.html',
  styleUrls: ['./feedback-contact-table.component.scss']
})
export class FeedbackContactTableComponent implements OnInit {
  @Input() feedback: Feedback
  
  constructor() { }

  ngOnInit() {
  }

}

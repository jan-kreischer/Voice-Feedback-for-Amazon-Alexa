import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Feedback } from '../../../models/feedback'

@Component({
  selector: 'app-feedback-overview',
  templateUrl: './feedback-overview.component.html',
  styleUrls: ['./feedback-overview.component.scss']
})
export class FeedbackOverviewComponent implements OnInit {
  @Input() feedback: Feedback
  constructor() { }

  ngOnInit() {
  }

}

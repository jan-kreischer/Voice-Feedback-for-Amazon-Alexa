import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Feedback } from '../../../models/feedback'

@Component({
  selector: 'app-feedback-overview-table',
  templateUrl: './feedback-overview-table.component.html',
  styleUrls: ['./feedback-overview-table.component.scss']
})
export class FeedbackOverviewTableComponent implements OnInit {
  @Input() feedback: Feedback
  
  constructor() { }

  ngOnInit() {
  }

}

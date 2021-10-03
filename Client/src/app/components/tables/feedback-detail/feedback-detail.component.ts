import { Component, OnInit, Input } from '@angular/core';
import { Feedback } from '../../../models/feedback'

@Component({
  selector: 'app-feedback-detail',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.scss']
})
export class FeedbackDetailComponent implements OnInit {
  @Input() feedback: Feedback
  constructor() { }

  ngOnInit() {
  }

}

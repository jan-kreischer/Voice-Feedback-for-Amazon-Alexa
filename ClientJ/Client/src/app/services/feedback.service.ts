import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feedback } from '../models/feedback'
import { Reply } from '../models/reply'
import {Observable} from 'rxjs';
import{ GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})

export class FeedbackService {
  apiUrl = GlobalConstants.apiUrl;
  
  markFeedbackAsProcessed (feedback_id): Observable<Feedback> {
    console.log("Mark feedback with " + feedback_id + " as processed!");  
    var url = `${this.apiUrl}/feedback/${feedback_id}/process`;
    return this.httpClient.patch<Feedback>(url, null);
  }
  
  deleteFeedback(feedback_id): Observable<any> {
    var url = `${this.apiUrl}/feedback/${feedback_id}`;
    return this.httpClient.delete(url, { responseType: 'text' });
  };
  
  getReplies(feedback_id: number) {
    var url = `${this.apiUrl}/feedback/${feedback_id}/replies`
    return this.httpClient.get<Reply[]>(url);
  }
  
  getFeedback(feedback_id: number) {
    var url = `${this.apiUrl}/feedback/${feedback_id}`;
    return this.httpClient.get<Feedback[]>(url);
  }
  
  getFeedbacks() {
    return this.httpClient.get<Feedback[]>(`${this.apiUrl}/feedback`);
  }
  
  postReply(feedback_id, reply_content) {
    console.log("Replying to Feedback " + feedback_id + "With reply_content:" + reply_content);
    var url = `${this.apiUrl}/feedback/${feedback_id}/reply`;

    const options = {
    hostname: this.apiUrl,
      port: 443,
      path: `/feedback/${feedback_id}/reply`,
      method: 'PATCH',
      headers: 
      {
        'Content-Type': 'application/json',
        'Content-Length': reply_content.length
      }
    }

 
    return this.httpClient.patch(url, {'reply_content': reply_content}, options);
  }

  constructor(private httpClient: HttpClient) { }
}

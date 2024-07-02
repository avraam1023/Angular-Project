import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  public Url = `http://localhost:5000/api/FeadBack`;
  public http = inject(HttpClient);

 // ტიპიზაცია!
  postFeedback(data: object) {
    return this.http.post(this.Url, data);
  }
}

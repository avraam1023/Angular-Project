import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private Url = `http://localhost:5000/api/Customer/Info`;
  private http = inject(HttpClient);

  // ტიპიზაცია!
  getUserData(): Observable<any> {
    return this.http.get(this.Url);
  }
}

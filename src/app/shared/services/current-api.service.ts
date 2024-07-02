import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrentApiService {
  private apiUrl = 'https://api.frankfurter.app/latest';

  constructor(private http: HttpClient) {}

  getExchangeRates(base: string): Observable<any> {
    // ტიპიზაცია უნდა!
    return this.http.get(`${this.apiUrl}?base=${base}`);
  }
}

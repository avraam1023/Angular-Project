import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TransactionQuantityService {
  private baseUrl = `http://localhost:5000/api/Statistic/GetTransactionQuantityWithDateAsync`;
  private http = inject(HttpClient);

  // ტიპიზაცია!
  getAllData(data: object) {
    return this.http.post(this.baseUrl, data);
  }
}

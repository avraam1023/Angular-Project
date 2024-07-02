import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getAllData() {
    // any ტიპი არის დიდი red flag!
    return this.http.get<any>(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&sparkline=false`
    );
  }

  getGrpahicalCurrencyData(coinId: string, days: number) {
    return this.http.get<any>( // საქმეს იფუჭებ ამდენი any-თ!
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=USD&days=${days}`
    );
  }

  getCurrencyById(coinId: string) {
    return this.http.get<any>(
      `https://api.coingecko.com/api/v3/coins/${coinId}`
    );
  }
}

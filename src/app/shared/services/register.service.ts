import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { signUp } from '../types/signUp';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RegisterService { // AuthService-ში გაგეერთიანებინა ყველა ავტორიზაციის ლოგიკა
  private readonly baseUrl = `http://localhost:5000/api/Customer/Registration`;
  private readonly httpClient = inject(HttpClient);
  private readonly route = inject(Router);

  inLoading$ = new BehaviorSubject<boolean>(false);

  signUp(data: signUp) {
    this.inLoading$.next(true);
    this.httpClient.post(this.baseUrl, data).subscribe(() => {
      this.inLoading$.next(false);
      this.route.navigate(['/login'], {
        queryParams: {
          signUpSuccess: true,
        },
      });
    });
  }
}

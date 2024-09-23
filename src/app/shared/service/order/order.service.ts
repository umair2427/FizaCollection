import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this.isLoading.asObservable();
  constructor(private http: HttpClient, private authService: AuthService) { }

  private setLoading(isLoading: boolean): void {
    this.isLoading.next(isLoading);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }

  addOrder(order: any): Observable<any> {
    this.setLoading(true);
    return this.http.post<any>(`${environment.url}createOrder`, order)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  getAllOrder(): Observable<any[]> {
    // const token = this.authService.getToken();
    // if (!token) {
    //   return throwError('Token not available');
    // }
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    return this.http.get<any>(`${environment.url}getUserOrders`)
    .pipe(
      catchError(this.handleError)
    )
  }
}

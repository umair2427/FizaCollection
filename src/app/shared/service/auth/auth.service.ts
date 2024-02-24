import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //Loaders
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  readonly isLoading$ = this.isLoading.asObservable();
  fb_reset_error: any;
  constructor(private http: HttpClient) { }

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

  private setLoading(isLoading: boolean): void {
    this.isLoading.next(isLoading);
  }

  registerUser(user: User): Observable<User> {
    this.setLoading(true);
    return this.http.post<User>(`${environment.url}register`, user)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }
  loginUser(user: User): Observable<User> {
    this.setLoading(true);
    return this.http.post<User>(`${environment.url}login`, user)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }
  forgotPassword(user: User): Observable<User> {
    this.setLoading(true);
    return this.http.post<User>(`${environment.url}forgetPassword`, user)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  resetPassword(user: User, token: string): Observable<User> {
    this.setLoading(true);
    return this.http.post<User>(`${environment.url}resetPassword/${token}`, user)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  logOut() {
    localStorage.removeItem('token');
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }
}

import { Injectable, Optional } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './User';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

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
  constructor(
    @Optional() private auth: Auth,
    private http: HttpClient,
  ) { }

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

  registerUser(payload: any): Observable<User> {
    this.setLoading(true);
    return this.http.post<User>(`${environment.url}user`, payload)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  async login(email: string, password: string): Promise<any> {
    try {
      this.setLoading(true);
      const res: any = await signInWithEmailAndPassword(this.auth, email, password);

      if (res) {
        this.setLoading(false);
        localStorage.setItem('idToken', res._tokenResponse.idToken);
        return res._tokenResponse.idToken;
      }
    } catch (error) {
      this.setLoading(false);
      console.error('Login failed:', error);
      return null;
    }

    return null;
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
    localStorage.removeItem('idToken');
  }

  getToken() {
    return localStorage.getItem('idToken');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }
}

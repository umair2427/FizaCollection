import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class IntercepService implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    // Check if token is available
    if (token) {
      // Clone the request and add the authorization header
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    // Forward the modified request and handle errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle errors here (e.g., log, show error message)
        return throwError(error);
      })
    );
  }
}

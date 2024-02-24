import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product } from './cart/Product'
import { environment } from 'src/environments/environment';

interface items {
  id?: number;
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  //Loaders
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this.isLoading.asObservable();
  productData: any;

  constructor(private http: HttpClient) { }

  private setLoading(isLoading: boolean): void {
    this.isLoading.next(isLoading);
  }

  getShopProducts(page: number, pageSize: number): Observable<any> {
    const url = `${environment.url}allShopProducts?page=${page}&pageSize=${pageSize}`;
    return this.http.get(url);
  }

  getSaleProducts(page: number, pageSize: number): Observable<any> {
    const url = `${environment.url}allSaleProducts?page=${page}&pageSize=${pageSize}`;
    return this.http.get(url);
  }

  getProductById(id: number): Observable<{ product: Product }> {
    this.setLoading(true);
    return this.http.get<{ product: Product }>(`${environment.url}getSingleProduct/${id}`)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  getCategories(): Observable<items> {
    return this.http.get<items>(`${environment.url}getCategories`)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  getColors(): Observable<items> {
    return this.http.get<items>(`${environment.url}getColors`)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  searchProduct(product: any) {
    return this.http.post<any>(`${environment.url}search`, product)
      .pipe(
        catchError(this.handleError),
      )
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError('Something went wrong. Please try again later.');
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
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

  getShopProducts(page: number, pageSize: number, category?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', pageSize.toString());

    if (category) {
      params = params.set('category', category);
    }

    const url = `${environment.url}shopProducts`;
    return this.http.get(url, { params });
  }

  getSaleProducts(page: number, pageSize: number, category?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', pageSize.toString());

    if (category) {
      params = params.set('category', category);
    }

    const url = `${environment.url}saleProducts`;
    return this.http.get(url, { params });
  }

  getAllProducts(page: number, pageSize: number): Observable<any> {
    const url = `${environment.url}getAllProducts?page=${page}&limit=${pageSize}`;
    return this.http.get(url);
  }

  getProductById(id: string): Observable<{ product: Product }> {
    this.setLoading(true);
    return this.http.get<{ product: Product }>(`${environment.url}products/${id}`)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  searchProduct(product: string, page: number = 1, limit: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('name', product);

    const url = `${environment.url}search`;
    return this.http.get(url, { params });
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

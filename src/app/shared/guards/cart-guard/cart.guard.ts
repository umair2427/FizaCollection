import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const myCart = JSON.parse(localStorage.getItem('myCart') || '[]') as any[];
    if (myCart && myCart?.length > 0) {
      console.log("Hello");

      return true;
    } else {
      return this.router.navigate(['/home']);
    }
  }

}

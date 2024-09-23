import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/shared/service/product.service';
import { Product } from '../../shared/service/cart/Product';
import { skipWhile, take } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  newProduct: any| undefined;
  products: any[] = [];
  page = 1;
  pageSize = 9;
  constructor(
    private productService: ProductService,
    private route: Router
    ) {}
  showDetails: boolean[] = new Array(this.products.length).fill(false);

  viewSingleProduct(id: number){
    this.newProduct = this.products.find((element:any)=>{
      return element._id === id;
    })
    if (this.newProduct) {
      this.route.navigate(['product-detail', this.newProduct._id]);
    } else {
      console.error('Product not found');
    }
   }
  ngOnInit(): void {
    this.loadProducts();
  }

  loadData(event: any) {
    this.page++;
    this.loadProducts(event);
  }

  private loadProducts(event?: any) {
    this.productService.getAllProducts(this.page, this.pageSize).pipe(skipWhile(val => !val), take(1)).subscribe(
      (data: any) => {
        this.products = this.products.concat(data.products);

        if (event) {
          event.target.complete();
        }
      },
      (error: Error) => {
        console.error(error);

        if (event) {
          event.target.complete();
        }
      }
    );
  }
}

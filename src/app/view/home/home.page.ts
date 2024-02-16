import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/shared/service/product.service';
import { Product } from '../../shared/service/cart/Product';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  newProduct: Product| undefined;
  products: Product[] = [];
  page = 1;
  pageSize = 9;
  constructor(
    private productService: ProductService,
    private route: Router
    ) {}
  showDetails: boolean[] = new Array(this.products.length).fill(false);

  viewSingleProduct(id: number){
    this.newProduct = this.products.find((element:any)=>{
      return element.id === id;
    })
    if (this.newProduct) {
      this.route.navigate(['product-detail', this.newProduct.id]);
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
    this.productService.getShopProducts(this.page, this.pageSize).subscribe(
      (data: { totalCount: number, products: Product[] }) => {
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

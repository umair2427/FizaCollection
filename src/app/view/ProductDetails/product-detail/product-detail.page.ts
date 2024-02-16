import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SideBarComponent } from 'src/app/shared/components/side-bar/side-bar.component';
import { ProductService } from 'src/app/shared/service/product.service';
import { Product } from '../../../shared/service/cart/Product'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CartService } from 'src/app/shared/service/cart/cart.service';


interface items {
  id?: number;
  name?: string;
  data?: any;
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  colors: items[] = [];
  productId!: number;
  product!: Product;
  getId!: number;
  productView: any;
  showProductInfo: boolean = true;
  showProductReturnPolicy: boolean = true;
  preRoute: string = ''
  loader: boolean = true;
  cartForm!: FormGroup
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public dialog: MatDialog,
    private _fb: FormBuilder,
    private cartService: CartService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.cartForm = this._fb.group({
      color: ['', [Validators.required]],
      quantity: [1]
    })
    this.fetchProductDetails();
    this.getColors();
  }

  // convenience getter for easy access to form fields
  get f() { return this.cartForm.controls; }

  fetchProductDetails(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      if (this.productId) {
        this.productService.getProductById(this.productId).subscribe(
          (product: any) => {
            this.product = product.product;
            this.loader = false;
          },
          error => {
            console.error('Error fetching product details:', error);
          }
        );
      }
    });
  }

  getColors(): void {
    this.productService.getColors().subscribe(
      (data: items) => {
        this.colors = data.data;
      },
      (error) => {
        console.error('Error fetching data from backend:', error);
      }
    );
  }

  addToCart(product: Product) {
    if(this.cartForm.invalid){
      // Mark all form controls as touched to display the validation errors
      Object.values(this.cartForm.controls).forEach(control => {
        control.markAsTouched();
      });
    } else{
      product.colorId = this.cartForm.get('color')?.value;
      product.quantity = this.cartForm.get('quantity')?.value;
      this.cartService.addToCart(product)
      this.openDialog(product);
    }
  }

  addToCartBuy(product: Product){
    product.colorId = this.cartForm.get('color')?.value || 1;
      product.quantity = this.cartForm.get('quantity')?.value || 1;
      this.cartService.addToCart(product);
      this.router.navigate(['payment-info']);
  }

  openDialog(product: Product) {
    this.dialog.open(SideBarComponent, {
      width: '400px',
      height: 'auto',
      data: product,
      position: { right: '0px', top: '0px' },
      panelClass: ['animate__animated', 'animate__slideInRight'],
      disableClose: true
    });
  }

  validateNumber(event: any) {
    const keyCode = event.keyCode;
    const excludedKeys = [8, 37, 39, 46];

    if (
      !(
        (keyCode >= 48 && keyCode <= 57) ||
        (keyCode >= 96 && keyCode <= 105) ||
        excludedKeys.includes(keyCode)
      )
    ) {
      event.preventDefault();
    }
  }
}

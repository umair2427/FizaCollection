import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SideBarComponent } from 'src/app/shared/components/side-bar/side-bar.component';
import { ProductService } from 'src/app/shared/service/product.service';
import { Product } from '../../../shared/service/cart/Product'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/shared/service/cart/cart.service';

interface items {
  id?: number;
  name?: string;
  data?: any;
}

@Component({
  selector: 'app-product-sale-detail',
  templateUrl: './product-sale-detail.page.html',
  styleUrls: ['./product-sale-detail.page.scss'],
})
export class ProductSaleDetailPage implements OnInit {
  productId!: string;
  preRoute: string = '';

  product!: any;
  productView: any;

  showProductInfo: boolean = true;
  showProductReturnPolicy: boolean = true;
  loader: boolean = true;

  colors: string[] = [];
  sizes: string[] = [];

  cartForm!: FormGroup

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private _fb: FormBuilder,
    public dialog: MatDialog,
    private cartService: CartService,) {
  }

  ngOnInit(): void {
    this.cartForm = this._fb.group({
      color: [null, [Validators.required]],
      size: [null, [Validators.required]],
      quantity: [1]
    })

    this.productId = this.route.snapshot.paramMap.get('id') || '';

    this.fetchProductDetails();
  }

  // convenience getter for easy access to form fields
  get f() { return this.cartForm.controls; }

  fetchProductDetails(): void {
    this.productService.getProductById(this.productId).subscribe(
      (product: any) => {
        this.product = product.product;
        this.colors = this.product.colors;
        this.sizes = this.product.sizes;
        this.loader = false;
      },
      error => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  addToCart(product: any) {
    if (this.cartForm.invalid) {
      // Mark all form controls as touched to display the validation errors
      Object.values(this.cartForm.controls).forEach(control => {
        control.markAsTouched();
      });
    } else {
      product.color = this.cartForm.get('color')?.value;
      product.size = this.cartForm.get('size')?.value;
      product.quantity = this.cartForm.get('quantity')?.value;
      this.cartService.addToCart(product)
      this.openDialog(product);
    }
  }

  addToCartBuy(product: any) {
    if (this.cartForm.invalid) {
      // Mark all form controls as touched to display the validation errors
      Object.values(this.cartForm.controls).forEach(control => {
        control.markAsTouched();
      });
    } else {
      product.color = this.cartForm.get('color')?.value || 1;
      product.size = this.cartForm.get('size')?.value || 1;
      product.quantity = this.cartForm.get('quantity')?.value || 1;
      this.cartService.addToCart(product);
      this.router.navigate(['payment-info']);
    }
  }

  openDialog(product: any) {
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

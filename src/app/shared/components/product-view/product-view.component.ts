import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { NavController } from '@ionic/angular';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../service/cart/cart.service';
import { ProductService } from '../../service/product.service';
import { SideBarComponent } from '../side-bar/side-bar.component';

interface items {
  id?: number;
  name?: string;
  data?: any;
}

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
})
export class ProductViewComponent implements OnInit {
  productData: any | undefined;
  colors: string[] = [];
  sizes: string[] = [];
  defaultProduct!: any;
  quantity!: number;
  currentColor!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any | undefined,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ProductViewComponent>,
    private navCtrl: NavController,
    private cartService: CartService,
    private productService: ProductService,
    private _fb: FormBuilder,

  ) {
    this.productData = this.data !== undefined ? this.data : undefined;
    this.colors =  this.productData.colors;
    this.sizes =  this.productData.sizes;

  }
  customOptions!: OwlOptions;
  cartForm!: FormGroup
  ngOnInit() {
    setTimeout(() => {
      this.customOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        navSpeed: 700,
        navText: this.productData?.productGalleryImages.map((image: any) => `<img src="${image}" width="20">`),
        responsive: {
          0: {
            items: 1
          }
        },
        nav: true
      }
    }, 300);
    this.cartForm = this._fb.group({
      color: [null, [Validators.required]],
      size: [null, [Validators.required]],
      quantity: [1]
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.cartForm.controls; }


  closeProductView() {
    this.dialogRef.close();
  }

  productDetail(product: any | undefined) {
    if (product && product.discountedPrice !== undefined && product.productDiscount !== 0) {
      this.navCtrl.navigateForward(`/product-sale-detail/${product._id}`);
      this.closeProductView();
    } else if (product && product.productDiscount !== undefined && product.productDiscount === 0) {
      this.navCtrl.navigateForward(`/product-detail/${product._id}`);
      this.closeProductView();
    }
  }

  openDialog() {
    this.dialog.open(SideBarComponent, {
      width: '400px',
      height: 'auto',
      position: { right: '0px', top: '0px' },
      panelClass: ['animate__animated', 'animate__slideInRight'],
      disableClose: true
    });
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
      this.cartService.addToCart(product);
      this.openDialog();
      this.closeProductView();
    }
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

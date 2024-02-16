import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CartService } from '../../service/cart/cart.service';
import { Product } from '../../service/cart/Product'

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  showIconArray: boolean[] = [];
  cartItems: Product[] = [];
  totalAmount!: number;
  arrayLength!: number;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SideBarComponent>,
    private router: Router,
    private cartService: CartService
  ) {
    //HoverIcon
    this.showIconArray = this.cartItems.map(() => false);
  }

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.arrayLength = this.cartItems.length;
    });

    this.cartService.totalAmount$.subscribe(updatedTotalAmount => {
      this.totalAmount = updatedTotalAmount;
    });

    const storedTotalAmount = localStorage.getItem('totalAmount');
    if (storedTotalAmount) {
      this.totalAmount = parseFloat(storedTotalAmount);
    } else {
      this.calculateTotalAmount();
    }
  }

  //Close dialog
  close() {
    document
      .getElementsByClassName('animate__animated')[0]
      .classList.remove('animate__slideInLeft');
    document
      .getElementsByClassName('animate__animated')[0]
      .classList.add('animate__slideOutRight');
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);
  }

  //Validate
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

  //Check quantity and increase quantity
  increaseQuantity(cartItem: Product) {
    cartItem.quantity = (cartItem.quantity || 0) + 1;
    this.cartService.updateCartItem(cartItem);
    this.getTotalIncrement()
    this.getTotalIncrement();
  }

  //Check quantity and decrease quantity
  decreaseQuantity(cartItem: Product) {
    if (cartItem.quantity && cartItem.quantity > 0) {
      cartItem.quantity -= 1;
      if (cartItem.quantity === 0) {
        this.cartService.removeFromCart(cartItem);
      } else {
        this.cartService.updateCartItem(cartItem);
        this.calculateTotalAmount();
        this.getTotalDecrement();
      }
    }
  }

  //Sum of all products when add to cart
  calculateTotalAmount() {
    let total = 0;
    for (let i = 0; i < this.cartItems.length; i++) {
      if (
        this.cartItems[i].productPrice !== undefined &&
        this.cartItems[i].quantity !== undefined &&
        this.cartItems[i].discountedPrice !== undefined &&
        +this.cartItems[i].discountedPrice! === 0
      ) {
        total +=
          this.cartItems[i].productPrice! * this.cartItems[i].quantity!;
      } else if (
        this.cartItems[i].discountedPrice !== undefined &&
        this.cartItems[i].quantity !== undefined &&
        +this.cartItems[i].discountedPrice! === 0
      ) {
        total +=
          +this.cartItems[i].discountedPrice! *
          this.cartItems[i].quantity!;
      }
    }
    this.totalAmount = total;
    localStorage.setItem('totalAmount', this.totalAmount.toString());
  }


  //Get total price when increase quantity
  getTotalIncrement() {
    let total = 0;
    for (var i = 0; i < this.cartItems.length; i++) {
      if (
        this.cartItems[i].productPrice !== undefined &&
        this.cartItems[i].quantity !== undefined &&
        this.cartItems[i].discountedPrice !== undefined &&
        +this.cartItems[i].discountedPrice! === 0
      ) {
        total +=
          this.cartItems[i].productPrice! * this.cartItems[i].quantity!;
      } else if (
        this.cartItems[i].discountedPrice !== undefined &&
        this.cartItems[i].quantity !== undefined &&
        +this.cartItems[i].discountedPrice! !== 0
      ) {
        total +=
          +this.cartItems[i].discountedPrice! *
          this.cartItems[i].quantity!;
      }
    }
    this.totalAmount = total;
    localStorage.setItem('totalAmount', this.totalAmount.toString());
  }


  //Get total price when decrease quantity
getTotalDecrement() {
  let total = 0;
  for (let i = 0; i < this.cartItems.length; i++) {
    if (
      this.cartItems[i].productPrice !== undefined &&
      this.cartItems[i].quantity !== undefined &&
      this.cartItems[i].discountedPrice !== undefined &&
      +this.cartItems[i].discountedPrice! === 0
    ) {
      total +=
        this.cartItems[i].productPrice! * this.cartItems[i].quantity!;
    } else if (
      this.cartItems[i].discountedPrice !== undefined &&
      this.cartItems[i].quantity !== undefined &&
      +this.cartItems[i].discountedPrice! !== 0
    ) {
      total +=
        +this.cartItems[i].discountedPrice! * this.cartItems[i].quantity!;
    }
  }
  console.log('Total:', total);

  this.totalAmount = total;
  localStorage.setItem('totalAmount', this.totalAmount.toString());
}


  //remove from localStorage onClick
  removeCart(cart: Product) {
    this.cartService.removeFromCart(cart);
    this.cartService.updateTotalAmountAndEmit();
  }

  viewCartDetails() {
    this.router.navigate(['view-cart']);
    this.close();
  }

}

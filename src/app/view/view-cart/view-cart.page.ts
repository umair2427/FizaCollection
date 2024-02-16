import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/service/cart/Product';
import { CartService } from 'src/app/shared/service/cart/cart.service';
import { ProductService } from 'src/app/shared/service/product.service';


@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.page.html',
  styleUrls: ['./view-cart.page.scss'],
})
export class ViewCartPage implements OnInit {
  cartItems: Product[] = [];
  totalAmount!: number;
  singleProductPrice!: number;
  constructor(
    private productService: ProductService,
    private cartService: CartService) { }

  ionViewWillEnter() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnInit() {
    this.cartService.totalAmount$.subscribe(updatedTotalAmount => {
      this.totalAmount = updatedTotalAmount;
    });
   }

   getColorName(colorId: number): string {
    switch (colorId) {
      case 1:
        return 'White';
      case 2:
        return 'Black';
      case 3:
        return 'Red';
      case 4:
        return 'Green';
      case 5:
        return 'Blue';
      default:
        return 'Unknown Color';
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
    if (cartItem.quantity && cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      this.cartService.updateCartItem(cartItem);
      this.calculateTotalAmount();
      this.getTotalDecrement();
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
    this.totalAmount = total;
    localStorage.setItem('totalAmount', this.totalAmount.toString());
  }

  calculateSingleProductPrice(product: Product): number {
    const discountedPrice = parseFloat(String(product.discountedPrice) || '');
    if (!isNaN(discountedPrice) && discountedPrice > 0) {
      return discountedPrice;
    }
    const productPrice = parseFloat(String(product.productPrice) || '');
    if (!isNaN(productPrice)) {
      return productPrice;
    }
    return 0;
  }

  //remove from localStorage onClick
  removeCart(cart: Product) {
    this.cartService.removeFromCart(cart);
    this.cartService.updateTotalAmountAndEmit();
  }
}

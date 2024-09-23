import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './Product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'myCart';
  private cartItemsSource = new BehaviorSubject<any[]>([]);
  private totalAmountSource = new BehaviorSubject<number>(0);
  cartItems$ = this.cartItemsSource.asObservable();
  totalAmount$ = this.totalAmountSource.asObservable();

  constructor() {
    this.loadCartItems();
  }

  private updateCartItemsInStorage(newCartItems: any[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(newCartItems));
    this.cartItemsSource.next(newCartItems);
    this.updateTotalAmount(newCartItems);
  }

  private updateTotalAmount(cartItems: any[]): void {
    let total = 0;
    for (const item of cartItems) {
      if (
        item.productPrice !== undefined &&
        item.quantity !== undefined &&
        item.discountedPrice !== undefined &&
        +item.discountedPrice! === 0
      ) {
        total += item.productPrice! * item.quantity!;
      } else if (
        item.discountedPrice !== undefined &&
        item.quantity !== undefined &&
        +item.discountedPrice! !== 0
      ) {
        total += +item.discountedPrice! * item.quantity!;
      }
    }
    localStorage.setItem('totalAmount', total.toString());
    this.totalAmountSource.next(total);
  }

  private loadCartItems(): void {
    const cartData = localStorage.getItem(this.cartKey);
    const cartItems: any[] = cartData ? JSON.parse(cartData) : [];
    this.cartItemsSource.next(cartItems);
    this.updateTotalAmount(cartItems);
  }

  getCartItems(): any[] {
    return this.cartItemsSource.getValue();
  }

  addToCart(item: any): void {
    const cartItems = this.cartItemsSource.getValue();
    const quantityToAdd: number = item.quantity || 1;

    const existingItem = cartItems.find(
      (existingItem) => existingItem._id === item._id 
    );

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + quantityToAdd;
    } else {
      item.quantity = quantityToAdd;
      cartItems.push(item);
    }

    this.updateCartItemsInStorage(cartItems);
  }


  updateCartItem(updatedItem: any): void {
    let cartItems = this.cartItemsSource.getValue();
    cartItems = cartItems.map((item) => {
      if (item.id === updatedItem.id) {
        return updatedItem;
      }
      return item;
    });
    this.updateCartItemsInStorage(cartItems);
  }

  removeFromCart(itemToRemove: any): void {
    let cartItems = this.cartItemsSource.getValue();
    cartItems = cartItems.filter((item) => item !== itemToRemove);
    this.updateCartItemsInStorage(cartItems);
  }

  updateTotalAmountAndEmit(): void {
    const cartItems = this.cartItemsSource.getValue();
    this.updateTotalAmount(cartItems);
    this.cartItemsSource.next(cartItems);
    this.updateTotalAmount(cartItems);
  }

  getTotalAmount(): number {
    const storedTotalAmount = localStorage.getItem('totalAmount');
    return storedTotalAmount ? parseFloat(storedTotalAmount) : 0;
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
    this.cartItemsSource.next([]);
    localStorage.removeItem('totalAmount');
  }
}

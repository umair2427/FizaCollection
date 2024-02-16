import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './Product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'myCart';
  private cartItemsSource = new BehaviorSubject<Product[]>([]);
  private totalAmountSource = new BehaviorSubject<number>(0);
  cartItems$ = this.cartItemsSource.asObservable();
  totalAmount$ = this.totalAmountSource.asObservable();

  constructor() {
    this.loadCartItems();
  }

  private updateCartItemsInStorage(newCartItems: Product[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(newCartItems));
    this.cartItemsSource.next(newCartItems);
    this.updateTotalAmount(newCartItems);
  }

  private updateTotalAmount(cartItems: Product[]): void {
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
    const cartItems: Product[] = cartData ? JSON.parse(cartData) : [];
    this.cartItemsSource.next(cartItems);
    this.updateTotalAmount(cartItems);
  }

  getCartItems(): Product[] {
    return this.cartItemsSource.getValue();
  }

  addToCart(item: Product): void {
    const cartItems = this.cartItemsSource.getValue();
    const quantityToAdd: number = item.quantity || 1;

    const existingItem = cartItems.find(
      (existingItem) => existingItem.id === item.id
    );

    if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + quantityToAdd;
  } else {
    item.quantity = quantityToAdd;
    cartItems.push(item);
  }

    this.updateCartItemsInStorage(cartItems);
  }

  updateCartItem(updatedItem: Product): void {
    let cartItems = this.cartItemsSource.getValue();
    cartItems = cartItems.map((item) => {
      if (item.id === updatedItem.id) {
        return updatedItem;
      }
      return item;
    });
    this.updateCartItemsInStorage(cartItems);
  }

  removeFromCart(itemToRemove: Product): void {
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

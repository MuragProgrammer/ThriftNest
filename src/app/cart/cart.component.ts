import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from '@app/_models/cart-item';
import { CartService } from '@app/_services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  userId = 'guest';
  cart: CartItem[] = [];
  agreed = false;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userId = currentUser?.id || 'guest';

    const cartData: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

    if (Array.isArray(cartData)) {
      this.cart = cartData.filter(item => item.userId === this.userId);
    } else {
      this.cart = [];
    }
  }


  increaseQty(item: CartItem): void {
    item.quantity++;
    this.cartService.saveCart(this.userId, this.cart);
    this.loadCart();
  }

  decreaseQty(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.saveCart(this.userId, this.cart);
      this.loadCart();
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(this.userId, productId);
    this.loadCart();
  }

  getSubtotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getShipping(): number {
    return 50;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShipping();
  }

  goToCheckout(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.router.navigate(['/checkout']);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '@app/_services/cart.service';
import { CartItem } from '@app/_models/cart-item';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;
  userId: string = 'null';
  showPopup = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user && user.id) {
      this.userId = user.id;
    }
  }

  addToCart(): void {
    const cartItem: CartItem = {
      userId: this.userId,
      productId: this.product.id,
      name: this.product.name,
      image: this.product.image,
      price: this.product.price,
      quantity: 1
    };

    this.cartService.addToCart(this.userId, cartItem);
    this.showPopup = true;

    // Hide popup after 2.5 seconds
    setTimeout(() => {
      this.showPopup = false;
    }, 2500);
  }
}


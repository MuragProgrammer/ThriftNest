import { Injectable } from '@angular/core';
import { CartItem } from '@app/_models/cart-item';

@Injectable({ providedIn: 'root' })
export class CartService {
    private key = 'cart';

    getCart(userId: string): CartItem[] {
        const allItems: CartItem[] = JSON.parse(localStorage.getItem(this.key) || '[]');
        return allItems.filter(item => item.userId === userId);
    }


    saveCart(userId: string, userCart: CartItem[]) {
        const allItems: CartItem[] = JSON.parse(localStorage.getItem(this.key) || '[]');

        // Remove old items for this user
        const others = allItems.filter(item => item.userId !== userId);

        // Add updated cart items (make sure they have correct userId)
        const updatedUserCart = userCart.map(item => ({ ...item, userId }));

        localStorage.setItem(this.key, JSON.stringify([...others, ...updatedUserCart]));
    }


    addToCart(userId: string, item: CartItem) {
        const cart = this.getCart(userId);
        const existing = cart.find(p => p.productId === item.productId);

        if (existing) {
            existing.quantity += item.quantity;
        } else {
            cart.push({ ...item, userId }); // ensure userId is added
        }

        this.saveCart(userId, cart);
    }


    removeFromCart(userId: string, productId: string) {
        const cart = this.getCart(userId).filter(p => p.productId !== productId);
        this.saveCart(userId, cart);
    }

    clearCart(userId: string) {
        this.saveCart(userId, []);
    }
}

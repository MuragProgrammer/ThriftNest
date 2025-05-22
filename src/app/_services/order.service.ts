import { Injectable } from '@angular/core';
import { Order } from '@app/_models/order';

@Injectable({ providedIn: 'root' })
export class OrderService {
    private readonly key = 'orders';

    getAll(): Order[] {
        const raw = localStorage.getItem(this.key);
        try {
        const orders: Order[] = JSON.parse(raw || '[]');
        return Array.isArray(orders) ? orders : [];
        } catch (e) {
        console.error('Error parsing orders from localStorage', e);
        return [];
        }
    }

    getByUser(userId: string): Order[] {
        return this.getAll().filter(order => order.userId === userId);
    }

    placeOrder(order: Order): void {
        const orders = this.getAll();
        orders.push(order);
        localStorage.setItem(this.key, JSON.stringify(orders));
    }

    deleteOrder(id: string): void {
        const orders = this.getAll().filter(order => order.id !== id);
        localStorage.setItem(this.key, JSON.stringify(orders));
    }

    getById(id: string): Order | undefined {
        return this.getAll().find(order => order.id === id);
    }

    updateStatus(id: string, status: Order['status']): void {
        const orders = this.getAll();
        const index = orders.findIndex(order => order.id === id);
        if (index !== -1) {
        orders[index].status = status;
        localStorage.setItem(this.key, JSON.stringify(orders));
        }
    }
}

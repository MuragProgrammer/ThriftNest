import { Component, OnInit } from '@angular/core';
import { Order } from '@app/_models/order';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  orders: Order[] = [];
  expandedOrders: Set<string> = new Set();

  ngOnInit(): void {
    const userData = localStorage.getItem('currentUser');
    this.user = userData ? JSON.parse(userData) : {};

    const orderData = localStorage.getItem('orders');
    const allOrders: Order[] = orderData ? JSON.parse(orderData) : [];

    this.orders = allOrders.filter(order => order.userId === this.user.id);
  }

toggleExpand(orderId?: string) {
  if (!orderId) return; // guard clause
  this.expandedOrders.has(orderId)
    ? this.expandedOrders.delete(orderId)
    : this.expandedOrders.add(orderId);
}

  getTotalItems(items: { quantity: number }[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  markAsDelivered(orderId: string) {
    if (!orderId) return;
    const order = this.orders.find(o => o.id === orderId);
    if (order && order.status !== 'delivered') {
      order.status = 'delivered';

      // Save the updated orders back to localStorage
      const orderData = localStorage.getItem('orders');
      let allOrders: Order[] = orderData ? JSON.parse(orderData) : [];

      const orderIndex = allOrders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        allOrders[orderIndex].status = 'delivered';
        localStorage.setItem('orders', JSON.stringify(allOrders));
      }
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '@app/_models/product';
import { Order } from '@app/_models/order';
import { User } from '@app/_models/user';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  products: Product[] = [];
  orders: Order[] = [];
  expandedOrderIds = new Set<string>();

  newProduct: Product = {
    name: '',
    price: 0,
    category: '',
    image: '',
    currency: 'PHP'
  };

  showProductModal = false;
  showProducts = false;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile?: File;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
    this.products = JSON.parse(localStorage.getItem('products') || '[]');
    this.orders = JSON.parse(localStorage.getItem('orders') || '[]');
  }

  openProductModal() {
    this.newProduct = {
      name: '',
      price: 0,
      category: '',
      image: '',
      currency: 'PHP'
    };
    this.showProductModal = true;
  }

  toggleExpand(orderId: string) {
    if (this.expandedOrderIds.has(orderId)) {
      this.expandedOrderIds.delete(orderId);
    } else {
      this.expandedOrderIds.add(orderId);
    }
  }

  closeProductModal() {
    this.showProductModal = false;
  }

  addProduct() {
    const newId = Date.now().toString();
    const newProduct = { ...this.newProduct, id: newId };
    this.products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(this.products));
    this.closeProductModal();
  }

  deleteProduct(id: string | undefined) {
    if (!id) return;
    this.products = this.products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  deleteUser(id: string | undefined) {
    if (!id) return;
    this.users = this.users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  deleteOrder(id: string | undefined) {
    if (!id) return;
    this.orders = this.orders.filter(o => o.id !== id);
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }
  toggleProducts() {
  this.showProducts = !this.showProducts;
}

  updateOrderStatus(id: string | undefined, status: 'shipped' | 'cancelled' | 'delivered') {
    const order = this.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      localStorage.setItem('orders', JSON.stringify(this.orders));
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  uploadImageAndAddProduct() {
    if (!this.selectedFile) {
      alert('Please select an image file!');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post<{ filename: string }>('/api/upload', formData).subscribe({
      next: (response) => {
        this.newProduct.image = 'assets/addedProducts/' + response.filename;
        this.addProduct();
        this.closeProductModal();
      },
      error: () => alert('Image upload failed')
    });
  }
  getTotalItems(items: { quantity: number }[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

}

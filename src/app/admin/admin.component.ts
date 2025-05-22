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
  isEditMode = false;
  editProductId: string | null = null;

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

  openProductModal(product?: Product) {
    if (product) {
      this.isEditMode = true;
      this.editProductId = product.id!;
      this.newProduct = { ...product };
    } else {
      this.isEditMode = false;
      this.editProductId = null;
      this.newProduct = {
        name: '',
        price: 0,
        category: '',
        image: '',
        currency: 'PHP'
      };
    }
    this.imagePreview = null;
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
  updateProduct() {
    if (!this.editProductId) return;

    const index = this.products.findIndex(p => p.id === this.editProductId);
    if (index !== -1) {
      this.products[index] = { ...this.newProduct, id: this.editProductId };
      localStorage.setItem('products', JSON.stringify(this.products));
      this.closeProductModal();
    }
  }

deleteProduct(id: string | undefined) {
  if (!id) return;

  const product = this.products.find(p => p.id === id);
  if (!product) return;

  this.products = this.products.filter(p => p.id !== id);
  localStorage.setItem('products', JSON.stringify(this.products));

  if (product.image.startsWith('assets/addedProducts/')) {
    const filename = product.image.replace('assets/addedProducts/', '');
    this.http.delete(`/api/products/${filename}`).subscribe({
      next: () => console.log('Image deleted successfully'),
      error: err => console.error('Image deletion failed:', err)
    });
  }
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
    if (!this.selectedFile && !this.isEditMode) {
      alert('Please select an image file!');
      return;
    }

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.http.post<{ filename: string }>('/api/upload', formData).subscribe({
        next: (response) => {
          this.newProduct.image = 'assets/addedProducts/' + response.filename;
          this.isEditMode ? this.updateProduct() : this.addProduct();
        },
        error: () => alert('Image upload failed')
      });
    } else {
      this.isEditMode ? this.updateProduct() : this.addProduct();
    }
  }

  getTotalItems(items: { quantity: number }[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '@app/_models/cart-item';
import { Country } from '@app/_models/country';
import { Router } from '@angular/router';
import { OrderService } from '@app/_services/order.service';
import { Order } from '@app/_models/order';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: CartItem[] = [];
  countries: Country[] = [];
  showPopup = false;

  contact = {
    email: '',
    phone: ''
  };

  shipping = {
    country: 'Philippines',
    state: '',
    address: '',
    city: '',
    fullname: ''
  };

  shippingFee = 0;
  paymentMethod: string = '';
  paymentPhone: string = '';
  paymentPhoneError: string = '';
  currentUserId: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.loadCart();

    // Redirect if cart is empty
    if (!this.cart.length) {
      this.router.navigate(['/products']);
      return;
    }

    this.loadUserInfo();
    this.loadCountries();

    if (!this.shipping.country && this.countries.length > 0) {
      this.shipping.country = this.countries[0].name;
    }
  }

  loadCart() {
    const data = localStorage.getItem('cart');
    try {
      const parsed = JSON.parse(data || '[]');
      this.cart = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Invalid cart data in localStorage:', e);
      this.cart = [];
    }
  }

  loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user) {
      this.contact.email = user.email || '';
      this.contact.phone = user.phone || '';
      this.currentUserId = user.id || '';
    }
  }

  loadCountries() {
    const saved = localStorage.getItem('country');
    if (saved) {
      this.countries = JSON.parse(saved);
      this.updateShippingFee();
    } else {
      this.http.get<Country[]>('/assets/data/country.json')
        .subscribe(data => {
          this.countries = data;
          localStorage.setItem('country', JSON.stringify(data));
          this.updateShippingFee();
        });
    }
  }

  updateShippingFee() {
    if (!this.countries?.length) return;
    const selected = this.countries.find(c => c.name === this.shipping.country);
    this.shippingFee = selected ? selected.shippingFee : 200;
    this.onCountryChange();
  }

  getSubtotal(): number {
    return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  proceedShipping() {
    const isValidPhone = this.validatePaymentPhone();
    if (!isValidPhone) return;

    const order: Order = {
      id: this.generateId(),
      userId: this.currentUserId,
      contactEmail: this.contact.email,
      items: this.cart.map(item => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity
      })),
      totalAmount: this.getSubtotal() + this.shippingFee,
      orderDate: new Date().toISOString(),
      status: 'pending',
      shipping: this.shipping
    };

    this.orderService.placeOrder(order);

    localStorage.removeItem('cart'); // Clear cart after order
    this.showPopup = true;

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }

  validatePaymentPhone() {
    const selectedCountry = this.countries.find(c => c.name === this.shipping.country);
    const phoneCode = selectedCountry?.phoneCode || '';

    if (this.paymentMethod === 'gcash' || this.paymentMethod === 'paymaya') {
      const trimmedPhone = this.paymentPhone.replace(phoneCode, '');
      if (!this.paymentPhone.startsWith(phoneCode)) {
        this.paymentPhoneError = `Phone must start with ${phoneCode}`;
        return false;
      }

      if (trimmedPhone.length !== 10) {
        this.paymentPhoneError = `Phone number must be exactly 10 digits after ${phoneCode}`;
        return false;
      }
    }

    this.paymentPhoneError = '';
    return true;
  }

  onCountryChange() {
    const selectedCountry = this.countries.find(c => c.name === this.shipping.country);
    const phoneCode = selectedCountry?.phoneCode || '';
    const rawNumber = this.paymentPhone.replace(/^\+\d+/, '');
    this.paymentPhone = phoneCode + rawNumber;
  }

  private generateId(): string {
    return 'order-' + Math.random().toString(36).substring(2, 10);
  }
}

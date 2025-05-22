import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '@app/_models/product';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private key = 'products';
    private productsSubject = new BehaviorSubject<Product[]>([]);
    products$ = this.productsSubject.asObservable();

    constructor(private http: HttpClient) {
        const stored = localStorage.getItem(this.key);
        if (stored) {
            console.log('Loaded products from localStorage:', JSON.parse(stored));
            this.productsSubject.next(JSON.parse(stored));
        } else {
            console.log('Loading products from JSON file...');
            this.loadProductsFromJson().subscribe(products => {
            console.log('Loaded products from JSON:', products);
            this.productsSubject.next(products);
            localStorage.setItem(this.key, JSON.stringify(products));
            });
        }
    }

    loadProductsFromJson(): Observable<Product[]> {
        return this.http.get<Product[]>('assets/data/products.json');
    }

    getAll(): Observable<Product[]> {
        return this.products$;
    }

    getAllSync(): Product[] {
        return this.productsSubject.value;
    }

    add(product: Product): void {
        product.id = crypto.randomUUID();
        const updated = [...this.productsSubject.value, product];
        this.productsSubject.next(updated);
        localStorage.setItem(this.key, JSON.stringify(updated));
    }

    update(id: string, updated: Partial<Product>) {
        const updatedProducts = this.productsSubject.value.map(p =>
            p.id === id ? { ...p, ...updated } : p
        );
        this.productsSubject.next(updatedProducts);
        localStorage.setItem(this.key, JSON.stringify(updatedProducts));
    }

    delete(id: string) {
        const filtered = this.productsSubject.value.filter(p => p.id !== id);
        this.productsSubject.next(filtered);
        localStorage.setItem(this.key, JSON.stringify(filtered));
    }

    getById(id: string): Product | undefined {
        return this.productsSubject.value.find(p => p.id === id);
    }
}

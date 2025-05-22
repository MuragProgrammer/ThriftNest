import { Component, OnInit } from '@angular/core';
import { ProductService } from '@app/_services/product.service';

@Component({
selector: 'app-all-products',
templateUrl: './all-products.component.html',
styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {
products: any[] = [];
allProducts: any[] = [];

constructor(private productService: ProductService) {}

    ngOnInit(): void {
        this.productService.getAll().subscribe(data => {
            this.allProducts = data;
            this.products = [...this.allProducts];
        });
    }

    onSearch(term: string): void {
        this.applyFilters({ search: term });
    }

    onFilterChange(filters: any): void {
        this.applyFilters(filters);
    }

    applyFilters(filters: any): void {
        let filtered = [...this.allProducts];

        if (filters.search) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(filters.search.toLowerCase())
        );
        }

        if (filters.category) {
        filtered = filtered.filter(p => p.category === filters.category);
        }

        if (filters.price != null) {
        filtered = filtered.filter(p => p.price <= filters.price);
        }

        this.products = filtered;
    }
}

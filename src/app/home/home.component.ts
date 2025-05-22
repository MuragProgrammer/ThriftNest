import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    allProducts: any[] = [];
    filteredProducts: any[] = [];

    selectedCategory: string = 'All';

    ngOnInit(): void {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
        this.allProducts = JSON.parse(storedProducts);

        // Sort by price descending
        const sortedByPrice = [...this.allProducts].sort((a, b) => b.price - a.price);
        this.filteredProducts = sortedByPrice.slice(0, 4);
        }
    }

    filterCategory(category: string): void {
        this.selectedCategory = category;

        let filtered = [...this.allProducts];

        if (category !== 'All') {
        filtered = filtered.filter(product => product.category?.toLowerCase() === category.toLowerCase());
        }

        // Show top 4 by price
        this.filteredProducts = filtered.sort((a, b) => b.price - a.price).slice(0, 4);
    }
}

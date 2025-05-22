import { Component, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.css']
})
export class ProductFiltersComponent {
  @Output() filterChange = new EventEmitter<any>();

  categories: string[] = ['Men', 'Women', 'Kids'];
  selectedCategory: string = '';
  priceRange: number = 250;

  transformY = 0;

  onFilterChange(): void {
    this.filterChange.emit({
      category: this.selectedCategory,
      price: this.priceRange
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.transformY = Math.min(scrollTop / 1, 2000);  // max 20px down
  }
}

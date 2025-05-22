import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent {
  @Output() search = new EventEmitter<string>();
  searchTerm: string = '';

  onSearch(): void {
    this.search.emit(this.searchTerm);
  }
}

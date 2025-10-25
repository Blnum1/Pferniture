import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-pd-6',
  templateUrl: './pd-6.component.html',
  styleUrl: './pd-6.component.css'
})
export class Pd6Component implements OnInit{
  product: Product[] = [];
  sortOrder: 'asc' | 'desc' = 'asc';
  sortLabel = 'ราคา';
  searchResults: any[] = [];
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    const DfcategoryId = 6;
    this.loadByCategory(DfcategoryId);
  }
  loadProducts(): void {
      this.productService.getAllProducts().subscribe((data: Product[]) => {
        this.product = data;
      });
    }
  
  loadByCategory(categoryId: number): void {
    this.productService.getCategoryByID(categoryId).subscribe((data: Product[]) => {
      this.product = data || [];
    }, err => {
      console.error('Load category failed', err);
      this.product = [];
    });
  }
  setSortOrder(order: 'asc' | 'desc') {
  this.sortOrder = order;
  this.sortLabel = order === 'asc' ? 'ราคา: จากน้อยไปมาก' : 'ราคา: จากมากไปน้อย';
  this.applySort();
}

applySort() {
  this.searchResults.sort((a, b) => {
    const priceA = Number(a.price ?? 0);
    const priceB = Number(b.price ?? 0);
    return this.sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
  });
}
}


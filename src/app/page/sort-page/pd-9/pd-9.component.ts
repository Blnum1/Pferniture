import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-pd-9',
  templateUrl: './pd-9.component.html',
  styleUrl: './pd-9.component.css'
})
export class Pd9Component implements OnInit{
  product: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    const DfcategoryId = 9;
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
}


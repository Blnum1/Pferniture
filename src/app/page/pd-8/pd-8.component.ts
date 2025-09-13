import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-pd-8',
  templateUrl: './pd-8.component.html',
  styleUrl: './pd-8.component.css'
})
export class Pd8Component implements OnInit{
  product: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    const DfcategoryId = 7;
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


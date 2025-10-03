import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-pd-2',
  templateUrl: './pd-2.component.html',
  styleUrl: './pd-2.component.css'
})
export class Pd2Component implements OnInit{
  product: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    const DfcategoryId = 2;
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


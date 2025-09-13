import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-pd-4',
  templateUrl: './pd-4.component.html',
  styleUrl: './pd-4.component.css'
})
export class Pd4Component implements OnInit{
  product: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    const DfcategoryId = 3;
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


import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-crudfurniture',
  templateUrl: './crudfurniture.component.html',
  styleUrl: './crudfurniture.component.css'
})
export class CrudfurnitureComponent implements OnInit {
  product: Product[] = [];
  newProduct: Product = {};
  editingProduct: Product | null = null;

  constructor(private productService: ProductService) { }

ngOnInit(): void {
  this.loadProducts();
}
  loadProducts(): void {
    this.productService.getAllProducts().subscribe((data: Product[]) => {
      this.product = data;
    });
}
  createProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe(() => {
      this.loadProducts();
      this.newProduct = {};
    });
}
  editProduct(product: Product): void {
    this.editingProduct = { ...product };
  }

  updateProduct(): void {
    if (this.editingProduct && this.editingProduct.productID) {
      this.productService.updateProduct(this.editingProduct.productID, this.editingProduct).subscribe(() => {
        this.loadProducts();
        this.editingProduct = null;
      });
    }
  }

  deleteProduct(id?: number): void {
    if (id) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }



}

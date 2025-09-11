import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ProductService } from './../../services/product.service';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-crudfurniture',
  templateUrl: './crudfurniture.component.html',
  styleUrls: ['./crudfurniture.component.css']
})
export class CrudfurnitureComponent implements OnInit {
  product: Product[] = [];
  searchProductId: number | null = null;
  searchProductName: string = '';
  searchCategoryId: number | null = null;
  searchCategoryName: string = '';
  searchPriceStart: number | null = null;
  searchPriceEnd: number | null = null;
  searchIsActive: string = '';
  matchMode: 'AND' | 'OR' = 'AND';

  newProduct: Product = {};
  editingProduct: Product | null = null;
  currentPage = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.searchProducts();  // โหลดข้อมูลทั้งหมดเมื่อเริ่มต้น
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['searchQuery'] && this.searchQuery) {
  //     this.searchProducts();
  //   }
  // }

  get totalProducts() {
    return this.product.length;
  }

  currentProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.product.slice(startIndex, endIndex); // ใช้สำหรับ pagination
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages() {
    return Math.ceil(this.totalProducts / this.pageSize);
  }

  updatePageSize() {
    this.currentPage = 1;
  }
  clearSearch(): void {
    this.searchProductId = null;
    this.searchProductName = '';
    this.searchCategoryId = null;
    this.searchCategoryName = '';
    this.searchPriceStart = null;
    this.searchPriceEnd = null;
    this.searchIsActive = '';
    this.loadProducts();
  }


  searchProducts(): void {
    if (this.searchProductId) {
      this.productService.getProductByID(this.searchProductId).subscribe((data: Product[]) => {
        this.product = data;
      });
      // } else if (this.searchProductName) {
      //   this.productService.getProductByName(this.searchProductName).subscribe((data: Product[]) => {
      //     this.product = data;
      //   });
    } else if (this.searchCategoryId) {
      this.productService.getCategoryByID(this.searchCategoryId).subscribe((data: Product[]) => {
        this.product = data;
      });
    } else {
      // ถ้าไม่มีค่าอะไรเลย โหลดสินค้าทั้งหมด
      this.loadProducts();
    }
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

  // editProduct(product: Product): void {
  //   this.editingProduct = { ...product };
  // }

  // updateProduct(): void {
  //   if (this.editingProduct && this.editingProduct.productID) {
  //     this.productService.updateProduct(this.editingProduct.productID, this.editingProduct).subscribe(() => {
  //       this.loadProducts();
  //       this.editingProduct = null;
  //     });
  //   }
  // }

  // deleteProduct(id?: number): void {
  //   if (id) {
  //     this.productService.deleteProduct(id).subscribe(() => {
  //       this.loadProducts();
  //     });
  //   }
  // }




}
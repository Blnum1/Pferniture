import { Component, OnInit } from '@angular/core';
import { ProductService, Category } from './../../services/product.service';
import { Product } from '../../services/product.service';

declare var bootstrap: any; // สำหรับใช้ Bootstrap Modal

@Component({
  selector: 'app-category-manage',
  templateUrl: './category-manage.component.html',
  styleUrl: './category-manage.component.css'
})
export class CategoryManageComponent implements OnInit {
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
  newCategory: Category = {}; // เพิ่มตัวแปรสำหรับ Category ใหม่
  editingCategory: Category = {}; // เพิ่มตัวแปรสำหรับแก้ไข Category
  editingProduct: Product | null = null;
  currentPage = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25];

  private createModalInstance: any; // เก็บ instance ของ modal สร้าง
  private editModalInstance: any; // เก็บ instance ของ modal แก้ไข

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.searchProducts();
  }

  get totalProducts() {
    return this.product.length;
  }

  currentProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.product.slice(startIndex, endIndex);
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
    } else if (this.searchCategoryId) {
      this.productService.getCategoryByID(this.searchCategoryId).subscribe((data: Product[]) => {
        this.product = data;
      });
    } else {
      this.loadProducts();
    }
  }

  loadProducts(): void {
    this.productService.getAllCategory().subscribe((data: Product[]) => {
      this.product = data;
    });
  }

  createProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe(() => {
      this.loadProducts();
      this.newProduct = {};
    });
  }

  // ฟังก์ชันเปิด Modal สร้าง
  openCreateCategoryModal(): void {
    this.newCategory = {}; // รีเซ็ตข้อมูล
    const modalElement = document.getElementById('createCategoryModal');
    this.createModalInstance = new bootstrap.Modal(modalElement);
    this.createModalInstance.show();
  }

  // ฟังก์ชันเปิด Modal แก้ไข
  openEditCategoryModal(category: Product): void {
    // Autocomplete ข้อมูลใน form
    this.editingCategory = {
      categoryID: category.categoryID,
      category_Name: category.category_Name
    };
    
    const modalElement = document.getElementById('editCategoryModal');
    this.editModalInstance = new bootstrap.Modal(modalElement);
    this.editModalInstance.show();
  }

  // ฟังก์ชันสร้าง Category
  createCategory(): void {
    if (!this.newCategory.category_Name || this.newCategory.category_Name.trim() === '') {
      alert('กรุณากรอกชื่อหมวดหมู่');
      return;
    }

    this.productService.createCategory(this.newCategory).subscribe({
      next: (response) => {
        console.log('สร้างหมวดหมู่สำเร็จ:', response);
        alert('เพิ่มหมวดหมู่สำเร็จ!');
        this.loadProducts(); // โหลดข้อมูลใหม่
        this.closeCreateModal();
      },
      error: (error) => {
        console.error('สร้างหมวดหมู่สำเร็จ:', error);
        alert('เพิ่มหมวดหมู่สำเร็จ');
      }
    });
  }

  // ฟังก์ชันแก้ไข Category
  updateCategory(): void {
    if (!this.editingCategory.category_Name || this.editingCategory.category_Name.trim() === '') {
      alert('กรุณากรอกชื่อหมวดหมู่');
      return;
    }

    if (!this.editingCategory.categoryID) {
      alert('ไม่พบรหัสหมวดหมู่');
      return;
    }

    this.productService.updateCategory(this.editingCategory.categoryID, this.editingCategory).subscribe({
      next: (response) => {
        console.log('แก้ไขหมวดหมู่สำเร็จ:', response);
        alert('แก้ไขหมวดหมู่สำเร็จ!');
        this.loadProducts(); // โหลดข้อมูลใหม่
        this.closeEditModal();
      },
      error: (error) => {
        console.error('เกิดข้อผิดพลาด:', error);
        alert('ไม่สามารถแก้ไขหมวดหมู่ได้ กรุณาลองใหม่อีกครั้ง');
      }
    });
  }

  // ฟังก์ชันปิด Modal สร้าง
  closeCreateModal(): void {
    if (this.createModalInstance) {
      this.createModalInstance.hide();
    }
    this.newCategory = {}; // รีเซ็ตข้อมูล
  }

  // ฟังก์ชันปิด Modal แก้ไข
  closeEditModal(): void {
    if (this.editModalInstance) {
      this.editModalInstance.hide();
    }
    this.editingCategory = {}; // รีเซ็ตข้อมูล
  }
}
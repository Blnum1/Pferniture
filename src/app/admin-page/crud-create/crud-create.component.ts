import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-crud-create',
  templateUrl: './crud-create.component.html',
  styleUrls: ['./crud-create.component.css']
})
export class CrudCreateComponent implements OnInit {
  product: Product = {
    productID: 0,
    product_Name: '',
    category_Name: '',
    categoryID: 0,
    size: '',
    color: '',
    price: 0,
    price_Discount: 0,
    pDescription1: '',
    pDescription2: '',
    pDescription3: '',
    image_Url1: '',
    image_Url2: '',
    image_Url3: '',
    stock: 0,
    is_Active: true
  };

  categories: any[] = []; // เก็บรายการหมวดหมู่ทั้งหมด
  filteredCategories: any[] = []; // เก็บรายการที่ filter แล้ว
  showDropdown: boolean = false; // แสดง/ซ่อน dropdown

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getAllCategory().subscribe({
      next: (data) => {
        // กรองเอาเฉพาะหมวดหมู่ที่ไม่ซ้ำกัน
        const uniqueCategories = data.reduce((acc: any[], current) => {
          const exists = acc.find(item => item.categoryID === current.categoryID);
          if (!exists && current.category_Name && current.categoryID) {
            acc.push({
              categoryID: current.categoryID,
              category_Name: current.category_Name
            });
          }
          return acc;
        }, []);
        
        this.categories = uniqueCategories;
        this.filteredCategories = [...this.categories];
      },
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  onCategorySearch(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    
    if (searchValue === '') {
      this.filteredCategories = [...this.categories];
    } else {
      this.filteredCategories = this.categories.filter(cat =>
        cat.category_Name.toLowerCase().includes(searchValue) ||
        cat.categoryID.toString().includes(searchValue)
      );
    }
    
    this.showDropdown = this.filteredCategories.length > 0;
  }

  selectCategory(category: any): void {
    this.product.category_Name = category.category_Name;
    this.product.categoryID = category.categoryID;
    this.showDropdown = false;
  }

  onCategoryFocus(): void {
    this.filteredCategories = [...this.categories];
    this.showDropdown = this.categories.length > 0;
  }

  onCategoryBlur(): void {
    // ใช้ setTimeout เพื่อให้คลิก dropdown ได้ก่อนที่จะซ่อน
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  createProduct(product: Product): void {
    const payload = {
      ...product,
      is_Active: product.is_Active ? 'YES' : 'NO'
    };

    this.productService.createProduct(payload).subscribe({
      next: () => {
        alert('Product created successfully');
        this.resetForm();
      },
      error: (err) => {
        console.error('Create failed:', err);
        alert('Failed to create product. Check console for details.');
      }
    });
  }

  resetForm(): void {
    this.product = {
      productID: 0,
      product_Name: '',
      category_Name: '',
      categoryID: 0,
      size: '',
      color: '',
      price: 0,
      price_Discount: 0,
      pDescription1: '',
      pDescription2: '',
      pDescription3: '',
      image_Url1: '',
      image_Url2: '',
      image_Url3: '',
      stock: 0,
      is_Active: true
    };
  }
}
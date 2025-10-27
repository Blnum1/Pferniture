import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service'; // ใช้ service ที่คุณมี

@Component({
  selector: 'app-crud-create',
  templateUrl: './crud-create.component.html',
  styleUrls: ['./crud-create.component.css']
})
export class CrudCreateComponent implements OnInit {
  product: Product = { // กำหนดค่าเริ่มต้นให้กับ product
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

  constructor(private productService: ProductService) {}

  ngOnInit(): void {}

  createProduct(product: Product): void {
  // 👇 แปลง boolean → string YES/NO ก่อนส่ง
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
    this.product = { // รีเซ็ตฟอร์ม
      productID: 0,
      product_Name: '',
      category_Name: '',
      categoryID: 0,
      size: '',
      price: 0,
      price_Discount: 0,
      pDescription1: '',
      pDescription2: '',
      pDescription3: '',
      image_Url1: '',
      image_Url2: '',
      image_Url3: '',
      stock: 0
    };
  }
}

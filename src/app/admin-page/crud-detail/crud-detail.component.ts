import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crud-detail',
  templateUrl: './crud-detail.component.html',
  styleUrls: ['./crud-detail.component.css']
})
export class CrudDetailComponent implements OnInit {
  product: Product | any = null; // ใช้ any ชั่วคราวเนื่องจาก is_Active อาจเป็น string หรือ boolean
  isEditMode: boolean = false; // เริ่มต้นเป็น false (โหมดดูอย่างเดียว)
  isDeleteConfirmed: boolean = false;

  showModal: boolean = false;
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductByID(Number(productId)).subscribe(data => {
        if (data && data.length > 0) {
          const rawProduct = data[0];

const isActiveBoolean =
  typeof rawProduct.is_Active === 'string'
    ? (rawProduct.is_Active as string).toUpperCase() === 'YES'
    : !!rawProduct.is_Active;
this.product = {
  ...rawProduct, // คัดลอกคุณสมบัติอื่น ๆ
  is_Active: isActiveBoolean // is_Active ถูกเก็บเป็น boolean ใน Angular
};
          
        } else {
          alert('Product not found or invalid response.');
          this.router.navigate(['/']); 
        }
      });
    }
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      this.updateProduct();
    } else {
      this.isEditMode = true;
    }
  }

  // ⭐⭐⭐ 2. การแปลงค่า is_Active จาก Boolean กลับไปเป็น String ("YES"/"NO") เมื่อบันทึก ⭐⭐⭐
  updateProduct(): void {
    if (this.product && this.product.productID !== undefined) {
      
      // สร้าง DTO สำหรับส่งไป API โดยแปลง is_Active กลับเป็น String
      const productDtoToSend = {
        ...this.product,
        is_Active: this.product.is_Active ? 'YES' : 'NO'
      };

      this.productService.updateProduct(this.product.productID, productDtoToSend).subscribe({
        next: () => {
          alert('Product updated successfully');
          this.isEditMode = false; // ปิดโหมดแก้ไขหลังจากบันทึกสำเร็จ
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Failed to update product. Check console for details.');
        }
      });
    }
  }

  cancelEdit(): void {
  window.location.reload();
}

  // ฟังก์ชันในการลบสินค้า
  handleDelete(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      if (this.product && this.product.productID !== undefined) {
        this.productService.deleteProduct(this.product.productID).subscribe({
            next: () => {
                alert('Product deleted successfully');
                this.router.navigate(['/']); 
            },
            error: (err) => {
                console.error('Delete failed:', err);
                alert('Failed to delete product.');
            }
        });
      }
    }
  }

  // ⭐⭐⭐ 3. แก้ไข: ฟังก์ชันสำหรับลบรูปภาพโดยตั้งค่า URL เป็น null ⭐⭐⭐
  removeImage(fieldName: 'image_Url1' | 'image_Url2' | 'image_Url3'): void {
    if (this.product) {
      const previous = this.product[fieldName];
      // ใช้ null เพื่อให้ Angular ส่งค่า null ไปยัง API ซึ่งจะล้าง field ในฐานข้อมูล
      this.product[fieldName] = null; 
      
      if (previous && this.selectedImage === previous) {
        this.selectedImage = null;
      }
      // บังคับให้เข้าสู่โหมดแก้ไข เมื่อทำการลบรูปภาพ (เพื่อให้ปุ่มเปลี่ยนเป็นบันทึก)
      this.isEditMode = true; 
      alert(`Image ${fieldName.slice(-1)} set to be removed upon saving.`);
    }
  }
  
  openModal(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedImage = null;
  }

  onImageUpload(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file || !this.product) {
      console.error('No file selected or product data is missing.');
      return;
    }
    
    // บังคับให้เข้าสู่โหมดแก้ไข เมื่ออัปโหลดไฟล์
    this.isEditMode = true; 

    const reader = new FileReader();
    reader.onload = () => {
      const newImageUrl = reader.result as string;
      
      // หาช่องว่างในการใส่รูปภาพ
      if (!this.product!.image_Url1) {
        this.product!.image_Url1 = newImageUrl;
      } else if (!this.product!.image_Url2) {
        this.product!.image_Url2 = newImageUrl;
      } else if (!this.product!.image_Url3) {
        this.product!.image_Url3 = newImageUrl;
      } else {
        const confirmReplace = confirm('All image slots are full. Do you want to replace Image 1?');
        if (confirmReplace) {
            this.product!.image_Url1 = newImageUrl;
        }
      }
      (event.target as HTMLInputElement).value = ''; 
    };
    reader.readAsDataURL(file);
  }
}

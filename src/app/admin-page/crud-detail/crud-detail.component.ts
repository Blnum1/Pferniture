import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { Router } from '@angular/router'; // เพื่อใช้ในการนำทาง

@Component({
  selector: 'app-crud-detail',
  templateUrl: './crud-detail.component.html',
  styleUrls: ['./crud-detail.component.css']
})
export class CrudDetailComponent implements OnInit {
  product: Product | null = null;  // ตัวแปรเก็บข้อมูลสินค้า
  isEditMode: boolean = false;     // กำหนดว่าอยู่ในโหมดแก้ไขหรือไม่
  isDeleteConfirmed: boolean = false;  // สำหรับการยืนยันการลบ

   showModal: boolean = false;
  selectedImage: string | null = null
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductByID(Number(productId)).subscribe(data => {
        this.product = data[0]; // สมมติว่าได้ข้อมูลแค่ 1 รายการ
      });
    }
  }

  // ฟังก์ชันที่ใช้เพื่อเปิด/ปิดโหมดแก้ไข
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      // ถ้าออกจากโหมดแก้ไขจะบันทึกข้อมูลที่แก้ไข
      this.updateProduct();
    }
  }

  // ฟังก์ชันในการบันทึกข้อมูลเมื่ออยู่ในโหมดแก้ไข
  updateProduct(): void {
    if (this.product) {
      this.productService.updateProduct(this.product.productID!, this.product).subscribe(() => {
        alert('Product updated successfully');
        this.isEditMode = false;  // ปิดโหมดแก้ไข
      });
    }
  }

  // ฟังก์ชันในการยืนยันการลบ
  handleDelete(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      if (this.product) {
        this.productService.deleteProduct(this.product.productID!).subscribe(() => {
          alert('Product deleted successfully');
          this.router.navigate(['/']);  // นำผู้ใช้กลับไปหน้าหลัก
        });
      }
    }
  }

   openModal(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.showModal = true;
  }

  // Function to close the modal
  closeModal(): void {
    this.showModal = false;
    this.selectedImage = null;
  }

  onImageUpload(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.product!.image_Url1 = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      console.error('No file selected');
    }
  }
}







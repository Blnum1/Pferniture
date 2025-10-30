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
  product: Product | any = null;
  isEditMode: boolean = false;
  isDeleteConfirmed: boolean = false;

  showModal: boolean = false;
  selectedImage: string | null = null;

  // เพิ่มตัวแปรสำหรับ autocomplete
  categories: any[] = [];
  filteredCategories: any[] = [];
  showDropdown: boolean = false;
  originalProduct: any = null; // เก็บข้อมูลเดิมสำหรับการยกเลิก

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories(); // โหลดหมวดหมู่ทั้งหมด
    
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
            ...rawProduct,
            is_Active: isActiveBoolean
          };
          
          // เก็บข้อมูลเดิมไว้สำหรับการยกเลิก
          this.originalProduct = JSON.parse(JSON.stringify(this.product));
          
        } else {
          alert('Product not found or invalid response.');
          this.router.navigate(['/']); 
        }
      });
    }
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
    if (this.isEditMode) {
      this.filteredCategories = [...this.categories];
      this.showDropdown = this.categories.length > 0;
    }
  }

  onCategoryBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      this.updateProduct();
    } else {
      this.isEditMode = true;
    }
  }

  updateProduct(): void {
    if (this.product && this.product.productID !== undefined) {
      const productDtoToSend = {
        ...this.product,
        is_Active: this.product.is_Active ? 'YES' : 'NO'
      };

      this.productService.updateProduct(this.product.productID, productDtoToSend).subscribe({
        next: () => {
          alert('Product updated successfully');
          this.isEditMode = false;
          this.originalProduct = JSON.parse(JSON.stringify(this.product));
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Failed to update product. Check console for details.');
        }
      });
    }
  }

  cancelEdit(): void {
    if (this.originalProduct) {
      this.product = JSON.parse(JSON.stringify(this.originalProduct));
      this.isEditMode = false;
    }
  }

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

  removeImage(fieldName: 'image_Url1' | 'image_Url2' | 'image_Url3'): void {
    if (this.product) {
      const previous = this.product[fieldName];
      this.product[fieldName] = null; 
      
      if (previous && this.selectedImage === previous) {
        this.selectedImage = null;
      }
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
    
    this.isEditMode = true; 

    const reader = new FileReader();
    reader.onload = () => {
      const newImageUrl = reader.result as string;
      
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
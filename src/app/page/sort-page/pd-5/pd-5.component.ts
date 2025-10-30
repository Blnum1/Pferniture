import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-pd-5',
  templateUrl: './pd-5.component.html',
  styleUrl: './pd-5.component.css'
})
export class Pd5Component implements OnInit{
  product: Product[] = [];
  sortOrder: 'asc' | 'desc' = 'asc';
  sortLabel = 'ราคา';
  searchResults: any[] = [];
  selectedProduct: any = null;
  quantity = 1;
  showModal = false;
  showToast = false;
  constructor(private productService: ProductService,private cartService: CartService) { }

  ngOnInit(): void {
    const DfcategoryId = 5;
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
  setSortOrder(order: 'asc' | 'desc') {
  this.sortOrder = order;
  this.sortLabel = order === 'asc' ? 'ราคา: จากน้อยไปมาก' : 'ราคา: จากมากไปน้อย';
  this.applySort();
}

applySort() {
  this.searchResults.sort((a, b) => {
    const priceA = Number(a.price ?? 0);
    const priceB = Number(b.price ?? 0);
    return this.sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
  });
}

openCartModal(product: any, event: MouseEvent) {
  event.preventDefault();       
  event.stopPropagation();     
  this.selectedProduct = product;
  this.quantity = 1;
  this.showModal = true;        
}

closeModal() {
    this.showModal = false;
  }

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    if (!this.selectedProduct) return;
    const userId = 1; // สมมติล็อกอินอยู่
    this.cartService.getOrCreateCart(userId).subscribe({
      next: (cartId) => {
        this.cartService.addItem(cartId, this.selectedProduct.productID, this.quantity).subscribe({
          next: () => {
            this.closeModal();
            this.showAddToCartToast();
          },
          error: (err) => console.error('เพิ่มสินค้าลงตะกร้าไม่สำเร็จ', err)
        });
      },
      error: (err) => console.error('ไม่สามารถสร้าง/ดึง cart ได้', err)
    });
  }
  showAddToCartToast() {
  this.showToast = true;
  setTimeout(() => {
    this.showToast = false;
  }, 3000); // แสดง 3 วินาที
}

}


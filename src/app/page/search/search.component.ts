import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  searchResults: any[] = [];
  sortOrder: 'asc' | 'desc' = 'asc';
  sortLabel = 'ราคา: จากน้อยไปมาก';
  showDropdown = false;
  showToast = false;

  quantity = 1;
  selectedProduct: any = null;
  showModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.searchQuery = (params['query'] ?? '').trim();
      if (this.searchQuery) this.searchProducts();
      else this.searchResults = [];
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  setSortOrder(order: 'asc' | 'desc') {
    this.sortOrder = order;
    this.sortLabel = order === 'asc' ? 'ราคา: จากน้อยไปมาก' : 'ราคา: จากมากไปน้อย';
    this.applySort();
    this.showDropdown = false;
  }

  applySort() {
    this.searchResults.sort((a, b) => {
      const priceA = Number(a.price ?? 0);
      const priceB = Number(b.price ?? 0);
      return this.sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });
  }

  searchProducts(): void {
    this.productService.searchProducts(this.searchQuery).subscribe({
      next: (results) => {
        this.searchResults = (results ?? []).sort((a, b) => Number(a.price) - Number(b.price));
      },
      error: (err) => {
        console.error('Error searching products:', err);
        this.searchResults = [];
      }
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

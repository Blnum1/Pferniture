// src/app/page/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService, CartItemDto } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  userID = 1;                // ดึงมาจาก AuthService.currentUser.id ในโปรเจกต์จริง
  cartID!: number;           // ได้มาจาก getOrCreate
  cartItems: CartItemDto[] = [];
  loading = true;
  errorMsg = '';
  allSelected = false;
  selectedTotal = 0;


  constructor(private cartSvc: CartService, private router: Router) { }

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    this.loading = true;
    this.errorMsg = '';
    this.cartSvc.getOrCreateCart(this.userID).subscribe({
      next: (cartId) => {
        this.cartID = cartId;
        this.cartSvc.getItems(cartId).subscribe({
          next: (items) => {
            this.cartItems = items ?? [];
            this.loading = false;
          },
          error: (err) => {
            this.errorMsg = 'โหลดรายการตะกร้าไม่สำเร็จ';
            console.error(err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.errorMsg = 'สร้าง/ดึงตะกร้าไม่สำเร็จ';
        console.error(err);
        this.loading = false;
      }
    });
  }

  increaseQuantity(ci: CartItemDto): void {
    const newQty = ci.quantity + 1;
    this.cartSvc.updateItemQuantity(ci.cartItemID, newQty).subscribe({
      next: () => ci.quantity = newQty,
      error: (err) => console.error(err)
    });
  }

  decreaseQuantity(ci: CartItemDto): void {
    if (ci.quantity <= 1) return;
    const newQty = ci.quantity - 1;
    this.cartSvc.updateItemQuantity(ci.cartItemID, newQty).subscribe({
      next: () => ci.quantity = newQty,
      error: (err) => console.error(err)
    });
  }

  remove(ci: CartItemDto): void {
    this.cartSvc.removeItem(ci.cartItemID).subscribe({
      next: () => this.cartItems = this.cartItems.filter(x => x.cartItemID !== ci.cartItemID),
      error: (err) => console.error(err)
    });
  }

  get total(): number {
    return this.cartItems.reduce((sum, i) => sum + (i.price_amount * i.quantity), 0);
  }

  updateSelection() {
    this.allSelected = this.cartItems.every(i => i.selected);
    this.selectedTotal = this.cartItems
      .filter(i => i.selected)
      .reduce((sum, i) => sum + (i.price_amount * i.quantity), 0);
  }

  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;
    this.cartItems.forEach(i => i.selected = this.allSelected);
    this.updateSelection();
  }
  hasSelection(): boolean {
    return this.cartItems.some(i => i.selected);
  }
  checkout() {
    const selected = this.cartItems.filter(i => i.selected);
    console.log('Selected items for checkout:', selected);
  }
  
}
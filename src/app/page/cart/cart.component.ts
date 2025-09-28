import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService, CartItemDto } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  userID = 1;
  cartID!: number;
  cartItems: CartItemDto[] = [];
  loading = true;
  errorMsg = '';
  allSelected = false;
  selectedTotal = 0;

  private sub = new Subscription();

  constructor(private cartSvc: CartService, private router: Router) { }

  ngOnInit(): void {
    this.sub.add(
      this.cartSvc.currentCartId$.subscribe(id => {
        if (id && id > 0) {
          this.loadCartItems(id);
        } else {
          this.loadOrCreate();
        }
      })
    );
    this.loadOrCreate();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private loadOrCreate(): void {
    this.loading = true;
    this.cartSvc.getOrCreateCart(this.userID).subscribe({
      next: (cartId) => {
        this.cartID = cartId;
        this.cartSvc.setCurrentCartId(cartId);
      },
      error: (err) => {
        this.errorMsg = 'สร้าง/ดึงตะกร้าไม่สำเร็จ';
        this.loading = false;
      }
    });
  }

  private loadCartItems(cartId: number): void {
    this.loading = true;
    this.errorMsg = '';
    this.cartID = cartId;
    this.cartSvc.getItems(cartId).subscribe({
      next: (items) => {
        this.cartItems = (items ?? []).map(it => ({ ...it, selected: false }));
        this.loading = false;
        this.updateSelection();
      },
      error: (err) => {
        this.errorMsg = 'โหลดรายการตะกร้าไม่สำเร็จ';
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
    this.allSelected = this.cartItems.length > 0 && this.cartItems.every(i => i.selected);
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
    if (!selected.length) {
      alert('กรุณาเลือกรายการที่จะชำระเงิน');
      return;
    }
    const subtotal = selected.reduce((sum, i) => sum + (i.price_amount * i.quantity), 0);
    this.router.navigate(['/payment'], {
      state: {
        cartID: this.cartID,
        items: selected,
        subtotal
      }
    });
  }
}

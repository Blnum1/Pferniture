import { Component, OnInit } from '@angular/core';
import { CartService, Order } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Order[] = [];
  userID: number = 1;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.getCartItems(this.userID).subscribe((data: Order[]) => {
      if (data && Array.isArray(data)) {
        this.cartItems = data;
      }
    });
  }

  // // ฟังก์ชันเพิ่มจำนวนสินค้า
  increaseQuantity(productID: number): void {
    const item = this.cartItems.find(i => i.productID === productID);
    if (item) {
      item.quantity++;
      this.updateCart(item);
    }
  }

  // ฟังก์ชันลดจำนวนสินค้า
  decreaseQuantity(productID: number): void {
    const item = this.cartItems.find(i => i.productID === productID);
    if (item && item.quantity > 1) {
      item.quantity--;
      this.updateCart(item);
    }
  }

  // ฟังก์ชันลบสินค้าออกจากตะกร้า
  removeFromCart(productID: number): void {
    this.cartItems = this.cartItems.filter(i => i.productID !== productID);
    this.updateCart();
  }

  // ฟังก์ชันคำนวณยอดรวม
  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + (item.price_amount * item.quantity), 0);
  }

  // ฟังก์ชันอัปเดตตะกร้า
  updateCart(item?: Order): void {
    // อัปเดตข้อมูลตะกร้าทั้งหมดที่จำเป็น เช่น เก็บใน localStorage หรือ API
    console.log('Updated Cart:', this.cartItems);
  }
}

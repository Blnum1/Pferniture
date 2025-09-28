import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, BehaviorSubject } from 'rxjs';

export interface CartItemDto {
  cartItemID: number;
  cartID: number;
  productID: number;
  product_Name: string;
  price_amount: number;
  quantity: number;
  image_Url1?: string;
  selected?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private base = 'http://localhost:5140/api/Cart';

  // BehaviorSubject เพื่อเก็บ CartID ปัจจุบัน
  private currentCartIdSubject = new BehaviorSubject<number>(0);
  currentCartId$ = this.currentCartIdSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ฟังก์ชันนี้จะตั้งค่า CartID ปัจจุบัน
  setCurrentCartId(cartId: number): void {
    this.currentCartIdSubject.next(cartId);
  }

  // ฟังก์ชันที่ใช้สร้างหรือดึง Cart
  getOrCreateCart(userId: number): Observable<number> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post<{ cartID: number }>(`${this.base}/GetOrCreateCart`, null, { params })
      .pipe(map(res => res.cartID));
  }

  // ฟังก์ชันดึงรายการสินค้าจาก Cart
  getItems(cartId: number): Observable<CartItemDto[]> {
    const params = new HttpParams().set('cartId', cartId.toString());
    return this.http.get<CartItemDto[]>(`${this.base}/Items`, { params });
  }

  // ฟังก์ชันเพิ่มสินค้าเข้า Cart
  addItem(cartId: number, productId: number, qty = 1): Observable<any> {
    return this.http.post(`${this.base}/AddItemToCart`, {
      cartID: cartId,
      productID: productId,
      quantity: qty
    });
  }

  // ฟังก์ชันอัปเดตจำนวนสินค้าภายใน Cart
  updateItemQuantity(cartItemId: number, qty: number): Observable<any> {
    return this.http.put(`${this.base}/UpdateItemQuantity`, {
      cartItemID: cartItemId,
      quantity: qty
    });
  }

  // ฟังก์ชันลบสินค้าจาก Cart
  removeItem(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.base}/RemoveItem/${cartItemId}`);
  }

  // ฟังก์ชันเคลียร์สินค้าทั้งหมดใน Cart
  clear(cartId: number): Observable<any> {
    const params = new HttpParams().set('cartId', cartId.toString());
    return this.http.delete(`${this.base}/Clear`, { params });
  }
}

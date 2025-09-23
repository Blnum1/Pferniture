import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface CartItemDto {
  cartItemID: number;
  cartID: number;
  productID: number;
  product_Name: string;
  price_amount: number;   // ราคาต่อชิ้น (unit price)
  quantity: number;
  image_Url1?: string;
   selected?: boolean;
  // เพิ่ม field ฝั่ง backend ที่ส่งมาได้ตามจริง
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private base = 'http://localhost:5140/api/Cart';

  constructor(private http: HttpClient) {}

  getOrCreateCart(userId: number): Observable<number> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post<{ cartID: number }>(`${this.base}/GetOrCreateCart`, null, { params })
      .pipe(map(res => res.cartID));
  }

  getItems(cartId: number): Observable<CartItemDto[]> {
    const params = new HttpParams().set('cartId', cartId.toString());
    return this.http.get<CartItemDto[]>(`${this.base}/Items`, { params });
  }

  addItem(cartId: number, productId: number, qty = 1): Observable<any> {
    return this.http.post(`${this.base}/AddItemToCart`, {
      cartID: cartId,
      productID: productId,
      quantity: qty
    });
  }

  updateItemQuantity(cartItemId: number, qty: number): Observable<any> {
    return this.http.put(`${this.base}/UpdateItemQuantity`, {
      cartItemID: cartItemId,
      quantity: qty
    });
  }

  removeItem(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.base}/RemoveItem/${cartItemId}`);
  }

  /** เคลียร์ทั้งตะกร้า */
  clear(cartId: number): Observable<any> {
    const params = new HttpParams().set('cartId', cartId.toString());
    return this.http.delete(`${this.base}/Clear`, { params });
  }
}

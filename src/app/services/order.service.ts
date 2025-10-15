// src/app/services/order.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = 'http://localhost:5140/api/Order';
  constructor(private http: HttpClient) {}

  createOrderFromCart(payload: {
    cartID: number;
    userID: number;
    shippingInfoID: number;
    payment: {
      payment_Method?: string;
      payment_Status?: string;
      payment_date?: string;
      payment_Amount?: number;
    };
    status?: string;
    order_date?: string;
    cartItems: { cartItemID: number, quantity: number }[];
  }) {
    return this.http.post(`${this.baseUrl}/CreateOrderFromCart`, payload);
  }

  
}

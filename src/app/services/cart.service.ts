import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  quantity: any;
  orderID: number;
  userID: number;
  email: string;
  firstName: string;
  lastName: string;
  productID: number;
  product_Name: string;
  status: string;
  price_amount: number;
  order_date: string;
  total_amount: number;
  address: string;
  shipping_Method: string;
  payment_Method: string;
  payment_Status: string;
  payment_date: string;
  payment_Amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:5140/api/Order'; 

  constructor(private http: HttpClient) {}

  getCartItems(userID: number): Observable<Order[]> {
  const params = new HttpParams().set('UserID', userID.toString());  
  return this.http.get<Order[]>(`${this.apiUrl}/GetOrderCart`, { params });
}

  getAllOrder(): Observable<Order[]> {
      return this.http.get<Order[]>(`${this.apiUrl}/GetOrderDetail`);
    }

  addToCart(productId: number, userId: number | null): Observable<any> {
    const body = {
      ProductID: productId,
      UserID: userId
    };
    return this.http.post(`${this.apiUrl}/AddToCart`, body);
  }
}

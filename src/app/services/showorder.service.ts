import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ShowOrder {
  userID: number;
  firstName: string;
  lastName: string;
  orderID: number;
  shippingInfoID: number;
  cartID: number;
  status: string;
  order_date: string;   
  orderItems: OrderItemDto[];

  shipping_Method: string;
  shipping_Phone: string;

  paymentID: number;
  payment_Method: string;
  payment_Status: string;
  payment_Amount: number;
  payment_date: string; 
}

export interface OrderItemDto {
  orderItemID: number;
  productID: number;
  quantity: number;
  price_Amount: number;
  product_Name: string;
  size: string;
  color: string;
  image_Url1: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShoworderService {
private apiUrl = 'http://localhost:5140/api/ShowOrder'; 

  constructor(private http: HttpClient) { }


  getOrders(status: string, userID: number): Observable<ShowOrder[]> {
    const params = new HttpParams()
      .set('status', status)
      .set('userid', userID.toString());

    return this.http.get<ShowOrder[]>(`${this.apiUrl}/GetShowOrder`, { params });
  }
}

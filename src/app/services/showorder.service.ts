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
  Shipping_Address: string;
  Shipping_City: string;
  Shipping_Region: string;
  Shipping_Postal_Code: string;

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
private apiUrl2 = 'http://localhost:5140/api/Order'; 
  constructor(private http: HttpClient) { }


  getOrders(status: string, userID: number): Observable<ShowOrder[]> {
    const params = new HttpParams()
      .set('status', status)
      .set('userid', userID.toString());

    return this.http.get<ShowOrder[]>(`${this.apiUrl}/GetShowOrder`, { params });
  }

   getAllOrders(status: string): Observable<ShowOrder[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<ShowOrder[]>(`${this.apiUrl}/GetShowAllOrder`, { params });
  }

  updateOrderStatus(orderID: number, orderStatus: string, paymentStatus: string): Observable<any> {
    const updateRequest = {
      OrderID: orderID,
      OrderStatus: orderStatus,
      PaymentStatus: paymentStatus
    };

    return this.http.post(`${this.apiUrl2}/UpdateOrderStatus`, updateRequest);
  }

  getOrderById(orderID: number): Observable<ShowOrder[]> {
    const params = new HttpParams()
      .set('orderID', orderID.toString());

    return this.http.get<ShowOrder[]>(`${this.apiUrl}/GetShowOrderByID`, { params });
  }

}

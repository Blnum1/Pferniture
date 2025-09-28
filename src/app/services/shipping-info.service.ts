import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface ShippingInfo {
  ShippingInfoID: number;
  UserID: number;
  Address: string;
  City?: string;
  Region?: string;
  Country?: string;
  Postal_Code?: number;
  Shipping_Method?: string;
  Shipping_Phone?: string;
}

export interface ShippingInfoCreateDto {
  UserID: number;
  Address: string;
  City?: string;
  Region?: string;
  Country?: string;
  Postal_Code?: number;
  Shipping_Method?: string;
  Shipping_Phone?: string;
}

export interface ShippingInfoUpdateDto {
  Address?: string;
  City?: string;
  Region?: string;
  Country?: string;
  Postal_Code?: number;
  Shipping_Method?: string;
  Shipping_Phone?: string;
}


@Injectable({ providedIn: 'root' })
export class ShippingInfoService {
  private base = 'http://localhost:5140'; 

  constructor(private http: HttpClient) {}

  getUserShippings(userId: number): Observable<ShippingInfo[]> {
    return this.http.get<ShippingInfo[]>(`${this.base}/api/ShippingInfo/GetUserShippings/${userId}`);

  }

  /** GET: /api/ShippingInfo/GetShipping/{id}?userId=... */
  getShipping(id: number, userId: number): Observable<ShippingInfo> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<ShippingInfo>(`${this.base}/api/ShippingInfo/GetShipping/${id}`, { params });
  }

  /** POST: /api/ShippingInfo/CreateShipping */
  createShipping(dto: ShippingInfoCreateDto): Observable<ShippingInfo> {
    return this.http.post<ShippingInfo>(`${this.base}/api/ShippingInfo/CreateShipping`, dto);
  }

  /** PUT: /api/ShippingInfo/UpdateShipping/{id}?userId=... */
  updateShipping(id: number, userId: number, dto: ShippingInfoUpdateDto): Observable<ShippingInfo> {
    const params = new HttpParams().set('userId', userId);
    return this.http.put<ShippingInfo>(`${this.base}/api/ShippingInfo/UpdateShipping/${id}`, dto, { params });
  }

  /** DELETE: /api/ShippingInfo/DeleteShipping/{id}?userId=... */
  deleteShipping(id: number, userId: number): Observable<void> {
    const params = new HttpParams().set('userId', userId);
    return this.http.delete<void>(`${this.base}/api/ShippingInfo/DeleteShipping/${id}`, { params });
  }
}

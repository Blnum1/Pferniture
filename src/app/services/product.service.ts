import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Product {
  productID?: number;
  categoryID?: number;
  product_Name?: string;
  size?: string;
  color?: string;
  pDescription1?: string;
  pDescription2?: string;
  pDescription3?: string;
  price?: number;
  price_Discount?: number;
  image_Url1?: string;
  image_Url2?: string;
  image_Url3?: string;
  is_Active?: boolean;
  stock?: number;
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private apiUrl = 'http://localhost:5140/api/Product'; // เปลี่ยนตาม backend ของคุณ

  constructor(private http: HttpClient) { }

  // GET products
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/GetProductAll`);
  }

  getProductByID(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/GetByProductID/${id}`);
  }
  // CREATE product
  createProduct(product: Product): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateProduct`, product);
  }

  // UPDATE product
  updateProduct(id: number, product: Product): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateProduct/${id}`, product);
  }

  // DELETE product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteProduct/${id}`);
  }
}

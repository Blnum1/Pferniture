import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Product {
  productID?: number;
  categoryID?: number;
  category_Name?: string;
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
  is_Active?: string | boolean;
  stock?: number;
}

export interface Category {
  categoryID?: number;
  category_Name?: string;
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private apiUrl = 'http://localhost:5140/api/Product'; 

  constructor(private http: HttpClient) { }


  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/GetProductAll`);
  }

  getAllCategory(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/GetCategoryAll`);
  }

 getProductByID(productID: number): Observable<Product[]> {
  const params = new HttpParams().set('productID', productID.toString());
  return this.http.get<Product[]>(`${this.apiUrl}/GetByProductID`, { params });
}

getCategoryByID(categoryID: number): Observable<Product[]> {
  const params = new HttpParams().set('categoryID', categoryID.toString());
  return this.http.get<Product[]>(`${this.apiUrl}/GetCategoryByID`, { params });
}


  createProduct(product: Product): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateProduct`, product);
  }

  createCategory(category: Category): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateCategory`, category);
  }

  updateProduct(id: number, product: Product): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateProduct/${id}`, product);
  }

  updateCategory(id: number, category: Category): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateCategory/${id}`, category);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteProduct/${id}`);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteCategory/${id}`);
  }

 searchProducts(query: string): Observable<any[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<any[]>(`${this.apiUrl}/SearchProducts`, { params });
  }

  searchCategoryById(categoryId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/SearchCategoryByID?categoryid=${categoryId}`);
  }
}

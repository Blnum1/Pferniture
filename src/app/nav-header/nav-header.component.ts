import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrl: './nav-header.component.css'
})
export class NavHeaderComponent {
  searchQuery: string = '';
  searchResults: any[] = [];
  modalOpen: boolean = false;

  isLoggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }
  
  constructor(private authService: AuthService, private router: Router, private productService: ProductService) { }
  logout() {
    this.authService.removeToken();
    this.router.navigateByUrl('/login');
  }

   onSearchInput(event: any) {
    if (this.searchQuery.length > 0) {  
      this.searchProducts();
    } else {
      this.searchResults = []; 
    }
  }

  searchProducts() {
    this.productService.searchProducts(this.searchQuery).subscribe({
      next: (results) => {
        this.searchResults = results; 
        console.log(this.searchResults);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  
  search() {
    if (this.searchQuery.length > 0) {  
      this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
    }
}
goToProductDetail(productID: number) {
    this.router.navigate(['/product-detail', productID]);  // ส่ง ID ไปยังหน้า Product Detail
  }
}
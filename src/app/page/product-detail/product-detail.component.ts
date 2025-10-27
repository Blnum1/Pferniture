import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

declare const bootstrap: any;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  images: string[] = [];
  selectedImage: string | null = null;
  isFavorite = false;
  quantity = 1;
  relatedProducts: Product[] = [];  // 👈 เปลี่ยนชื่อให้ชัดเจน
  loading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
  this.authService.loadCurrentUser();

  this.route.paramMap.subscribe(params => {
    const productId = Number(params.get('id'));
    if (productId) {
      this.loadProduct(productId);
    }
  });
}

  private buildImages(): void {
    this.images = [];
    this.selectedImage = null;
    if (!this.product) return;

    if (this.product.image_Url1) this.images.push(this.product.image_Url1);
    if (this.product.image_Url2) this.images.push(this.product.image_Url2);
    if (this.product.image_Url3) this.images.push(this.product.image_Url3);
    this.selectedImage = this.images[0] ?? null;
  }

  private loadProduct(productId: number): void {
  this.productService.getProductByID(productId).subscribe(data => {
    this.product = (data && data.length) ? data[0] : null;
    this.buildImages();

    if (this.product?.categoryID) {
      this.loadByCategory(this.product.categoryID);
    }

    this.quantity = 1;
  });
}

  loadByCategory(categoryId: number): void {
    this.productService.getCategoryByID(categoryId).subscribe({
      next: (data: Product[]) => {
        const currentId = this.product?.productID;
        this.relatedProducts = data.filter(p => p.productID !== currentId);
      },
      error: (err) => {
        console.error('Load related category failed', err);
        this.relatedProducts = [];
      }
    });
  }

  selectImage(img?: string | number): void { /* ... */ }
  goToSlide(index: number) { /* ... */ }

  addToCart(): void {
    if (!this.product?.productID) return;
    const userId = this.authService.currentUser.value?.id;
    if (!userId) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.cartService.getOrCreateCart(userId).subscribe({
      next: (cartId) => {
        this.cartService.addItem(cartId, this.product!.productID!, this.quantity).subscribe({
          next: () => this.router.navigate(['/cart']),
          error: (err) => console.error('Add item failed:', err)
        });
      },
      error: (err) => console.error('Get/Create cart failed:', err)
    });
  }

  increaseQty() { this.quantity++; }
  decreaseQty() { if (this.quantity > 1) this.quantity--; }
  toggleFavorite() { this.isFavorite = !this.isFavorite; }
}

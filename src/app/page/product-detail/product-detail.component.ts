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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // โหลดสินค้า
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.productService.getProductByID(productId).subscribe(data => {
        this.product = (data && data.length) ? data[0] : null;
        this.buildImages();
      });
    }

    // ให้แน่ใจว่า currentUser ถูกเติมข้อมูล
    this.authService.loadCurrentUser();
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

  selectImage(img?: string | number): void {
    if (!this.images?.length) return;
    const idx = typeof img === 'number' ? img : this.images.indexOf(img ?? '');
    this.goToSlide(Math.max(0, Math.min(idx, this.images.length - 1)));
  }

  private goToSlide(index: number) {
    const el = document.getElementById('productCarousel');
    if (typeof bootstrap !== 'undefined' && el) {
      try {
        const inst = bootstrap.Carousel.getInstance(el) ?? new bootstrap.Carousel(el);
        inst.to(index);
        return;
      } catch {}
    }
    if (this.images[index]) this.selectedImage = this.images[index];
  }

  addToCart(): void {
    if (!this.product?.productID) return;

    const userId = this.authService.currentUser.value?.id;
    if (!userId) {
      // ยังไม่ล็อกอิน -> ส่งไปหน้า login หรือตามที่ต้องการ
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    // 1) สร้าง/ดึง cartID ของผู้ใช้  2) เพิ่มสินค้า  3) ไปหน้า cart
    this.cartService.getOrCreateCart(userId).subscribe({
      next: (cartId) => {
        this.cartService.addItem(cartId, this.product!.productID!, 1).subscribe({
          next: () => this.router.navigate(['/cart']),
          error: (err) => console.error('Add item failed:', err)
        });
      },
      error: (err) => console.error('Get/Create cart failed:', err)
    });
  }

  confirmDelete(){ /* ... */ }
  toggleFavorite(){ this.isFavorite = !this.isFavorite; }
}

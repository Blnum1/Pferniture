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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) { }

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
      } catch { }
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

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

  buyNow(): void {
  if (!this.product?.productID) return;

  const userId = this.authService.currentUser.value?.id;
  if (!userId) {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    return;
  }

  // 1) สร้างหรือดึง cart ของ user
  this.cartService.getOrCreateCart(userId).subscribe({
    next: (cartId) => {
      // 2) เพิ่มสินค้าเข้าตะกร้า
      this.cartService.addItem(cartId, this.product!.productID!, this.quantity).subscribe({
        next: () => {
          // 3) ดึงข้อมูลสินค้าในตะกร้า แล้วส่งไปหน้า payment
          this.cartService.getItems(cartId).subscribe({
            next: (items) => {
              const subtotal = items.reduce((s: number, i: any) => s + i.price_amount * i.quantity, 0);
              this.router.navigate(['/payment'], {
                state: {
                  cartID: cartId,
                  items,
                  subtotal
                }
              });
            },
            error: (err) => console.error('โหลดสินค้าในตะกร้าไม่สำเร็จ:', err)
          });
        },
        error: (err) => console.error('เพิ่มสินค้าไม่สำเร็จ:', err)
      });
    },
    error: (err) => console.error('สร้าง/ดึง cart ไม่สำเร็จ:', err)
  });
}


  confirmDelete() { /* ... */ }
  toggleFavorite() { this.isFavorite = !this.isFavorite; }
}

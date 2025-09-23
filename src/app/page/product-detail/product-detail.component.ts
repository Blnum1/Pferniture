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
  userId: number | null = null;
  isFavorite: false | undefined;

  // รูปที่เกี่ยวข้อง
  images: string[] = [];
  selectedImage: string | null = null; 

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductByID(Number(productId)).subscribe(data => {
        this.product = data && data.length ? data[0] : null;
        this.buildImages();
      });
    }
    this.authService.loadCurrentUser();
  }

  private buildImages(): void {
    this.images = [];
    this.selectedImage = null;

    if (!this.product) return;

    if (this.product.image_Url1) this.images.push(this.product.image_Url1);
    if (this.product.image_Url2) this.images.push(this.product.image_Url2);
    if (this.product.image_Url3) this.images.push(this.product.image_Url3);

    this.selectedImage = this.images.length ? this.images[0] : null;
  }

  selectImage(img?: string | number): void {
    if (!this.images || this.images.length === 0) return;

    if (typeof img === 'string') {
      const idx = this.images.indexOf(img);
      if (idx >= 0) {
        this.goToSlide(idx);
      } else {
        this.selectedImage = img; // fallback
      }
      return;
    }

    const index = (typeof img === 'number') ? img : 0;
    this.goToSlide(index);
  }

  private goToSlide(index: number) {
    const carouselEl = document.getElementById('productCarousel');
    if (typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
    try {
      const instance = bootstrap.Carousel.getInstance(carouselEl) ?? new bootstrap.Carousel(carouselEl);
      instance.to(index);
      return;
    } catch (err) {
      console.warn('bootstrap carousel control failed', err);
    }
  }

    if (this.images && this.images[index]) {
    this.selectedImage = this.images[index];
  }
  }

  addToCart() {
    if (this.product) {
      // ดึง UserID จาก AuthService
      const validUserId = this.authService.currentUser.value?.id ?? 0;  // ถ้า currentUser ไม่มีค่าให้ใช้ 0 (guest)

      // ส่งข้อมูลไปยัง backend เพื่อเพิ่มสินค้าในตะกร้า
      this.cartService.addToCart(this.product.productID ?? 0, validUserId).subscribe(
        (response) => {
          console.log('Product added to cart:', response);
          this.router.navigate(['/cart']);  // ไปยังหน้าตะกร้า
        },
        (error) => {
          console.error('Error adding to cart:', error);
        }
      );
    }
  }
  confirmDelete(){
    console.log ("hello del");
  }
  toggleFavorite(){
    console.log ("hello favor");
  }
}

import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

declare const bootstrap: any; 

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'] 
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null; 
  isFavorite: false | undefined;

  // รูปที่เกี่ยวข้อง
  images: string[] = [];
  selectedImage: string | null = null; 

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductByID(Number(productId)).subscribe(data => {
        this.product = data && data.length ? data[0] : null;
        this.buildImages();
      });
    }
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

  addToCart(){
    console.log ("hello add");
  }
  confirmDelete(){
    console.log ("hello del");
  }
  toggleFavorite(){
    console.log ("hello favor");
  }
}

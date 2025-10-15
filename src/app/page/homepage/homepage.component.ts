import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

interface ProductThumbnail {
  id: number;
  imageUrl: string; 
  productName: string;
  categoryName: string;
}

interface MainSlide {
  mainImageUrl: string; 
  thumbnails: ProductThumbnail[]; 
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit{
  product: Product[] = [];
    category1Products: Product[] = []; // Products for category 1
  category2Products: Product[] = []; // Products for category 2
  category3Products: Product[] = []; // Products for category 3

  currentMainImageIndex: number = 0;
  isZoomModalOpen: boolean = false;

  openZoomModal(): void {
    this.isZoomModalOpen = true;
    document.body.style.overflow = 'hidden'; 
  }

  closeZoomModal(): void {
    this.isZoomModalOpen = false;
    document.body.style.overflow = 'auto'; 
  }

   slides: MainSlide[] = [
    { 
      mainImageUrl: 'https://www.ikea.com/pimg/1023703_pe833221_s5.jpg?f=xl', 
      thumbnails: [
        { id: 24, imageUrl: 'https://www.ikea.com/th/th/images/products/aepplaryd-3-seat-sofa-djuparp-dark-blue__0992903_pe820321_s5.jpg?f=xs', productName: 'ÄPPLARYD แอพพลารีด์', categoryName: 'โซฟา (3 ที่นั่ง)' },
        { id: 2, imageUrl: 'https://www.ikea.com/th/th/images/products/vittsjoe-coffee-table-black-brown-glass__0135348_pe292039_s5.jpg?f=xxs', productName: 'VITTSJÖ วิทท์เชอ', categoryName: 'โต๊ะกลาง' },
        { id: 3, imageUrl: 'https://www.ikea.com/pimg/1000276_pe824194_s5.jpg?f=xxs', productName: 'KALLVIKEN คัลล์วีคเกน', categoryName: 'บานตู้' },
        // { id: 104, imageUrl: 'https://www.ikea.com/pimg/0802778_pe768589_s5.jpg?f=xxs', productName: 'SÖDERHAMN เซอเดอร์ฮัมน์', categoryName: 'โซฟาเดี่ยว' },
      ]
    },
    { 
      mainImageUrl: 'https://d2rbyiw1vv51io.cloudfront.net/web/ikea4/images/743/1074370_PH183257_S5.jpg?v=revamp202506111017', 
      thumbnails: [
        { id: 201, imageUrl: 'https://www.ikea.com/pimg/0802778_pe768589_s5.jpg?f=xxs', productName: 'SÖDERHAMN เซอเดอร์ฮัมน์', categoryName: 'โซฟาเดี่ยว' },
        { id: 202, imageUrl: 'https://www.ikea.com/pimg/0955982_pe804391_s5.jpg?f=xxs', productName: 'BJÖRKÅSEN บยอร์คัวเซียน', categoryName: 'โต๊ะวางแล็ปท็อป' },
        { id: 203, imageUrl: 'https://www.ikea.com/th/th/images/products/eket-wall-mounted-shelving-unit-white__1326081_pe944109_s5.jpg?f=xxs', productName: 'EKET เอียคเกท', categoryName: 'ชั้นแขวนผนัง' },
        { id: 204, imageUrl: 'https://www.ikea.com/th/th/images/products/besta-storage-combination-with-doors-white-bjoerkoeviken-mejarp-birch-veneer__0996726_pe822464_s5.jpg?f=xxs', productName: 'BESTÅ เบสตัว', categoryName: 'ตู้เก็บของพร้อมบานตู้' },
      ]
    },

  ];
  constructor(private productService: ProductService,private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
      this.productService.getAllProducts().subscribe((data: Product[]) => {
        this.product = data;
         this.filterProductsByCategory();
      });
    }
    filterProductsByCategory(): void {
    this.category1Products = this.product.filter(product => product.categoryID === 1);
    this.category2Products = this.product.filter(product => product.categoryID === 2);
    this.category3Products = this.product.filter(product => product.categoryID === 3);
  }

    currentSlideIndex: number = 0; 
  
  // Getter เพื่อให้เรียกใช้ง่ายขึ้นใน HTML
  get currentSlide(): MainSlide {
      return this.slides[this.currentSlideIndex];
  }


  // 📌 Logic สำหรับเลื่อนไปรูปถัดไป (ควบคุมทั้ง Main Image และ List)
  nextImage(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

  // 📌 Logic สำหรับเลื่อนไปรูปก่อนหน้า (ควบคุมทั้ง Main Image และ List)
  prevImage(): void {
    const total = this.slides.length;
    this.currentSlideIndex = (this.currentSlideIndex - 1 + total) % total;
  }
  
  // ฟังก์ชันนี้ตอนนี้ไม่จำเป็นต้องเปลี่ยนรูปหลักแล้ว เพราะรูปหลักเปลี่ยนตาม next/prev
  selectProductImage(index: number): void {
      const selectedProduct = this.currentSlide.thumbnails[index];
      
      if (selectedProduct && selectedProduct.id) {
          // ใช้ ID ที่คุณ fix นำทางไปหน้า Product Detail
          this.router.navigate(['/product-detail', selectedProduct.id]);
      } else {
          console.error("Product ID not found for the selected thumbnail.");
      }
    }



}

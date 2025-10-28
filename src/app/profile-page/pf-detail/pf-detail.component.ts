import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoworderService } from '../../services/showorder.service';

@Component({
  selector: 'app-pf-detail',
  templateUrl: './pf-detail.component.html',
  styleUrls: ['./pf-detail.component.css']
})
export class PfDetailComponent implements OnInit {
  orderID!: number;
  order: any;
  loading = true;
  error: string | null = null;

  shippingSteps: string[] = [
    'การจัดเตรียมสินค้า',
    'การส่งสินค้าไปยังศูนย์กระจายสินค้า',
    'การจัดส่งไปยังที่อยู่ลูกค้า',
    'การจัดส่งเสร็จสิ้น'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showOrderService: ShoworderService
  ) {}

  ngOnInit(): void {
    this.orderID = +this.route.snapshot.paramMap.get('orderID')!;
    this.loadOrder();
  }

  loadOrder(): void {
    this.showOrderService.getOrderById(this.orderID).subscribe({
      next: (data) => {
        this.loading = false;
        this.order = Array.isArray(data) ? data[0] : data;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'ไม่สามารถโหลดข้อมูลได้';
        console.error(err);
      }
    });
  }

  canPay(): boolean {
    return (
      this.order?.payment_Method === 'QR' &&
      this.order?.payment_Status === 'Pending' &&
      this.order?.status === 'waitpay'
    );
  }

  goToPaymentConfirm(): void {
    this.router.navigate(['/payment-confirm', this.order.orderID], {
      state: {
        orderId: this.order.orderID,
        payMethod: this.order.payment_Method,
        amount: this.order.payment_Amount,
        customerName: `${this.order.shippingFirstName} ${this.order.shippingLastName}`
      }
    });
  }

  shipping(): boolean {
    return (this.order?.status === 'musttranfer'
    );
  }
}

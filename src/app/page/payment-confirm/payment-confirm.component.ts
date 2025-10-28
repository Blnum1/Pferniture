import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShoworderService } from '../../services/showorder.service';

@Component({
  selector: 'app-payment-confirm',
  templateUrl: './payment-confirm.component.html',
  styleUrls: ['./payment-confirm.component.css']
})
export class PaymentConfirmComponent implements OnInit {
  orderId!: number;
  order: any;
  payMethod = '';
  amount = 0;
  customerName = '';
  showQR = false;
  qrUrl = '';
  loading = true;
  paidSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private showOrderSvc: ShoworderService,
  ) {}

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('orderID')!;
    const st: any = history.state;
    this.payMethod = st?.payMethod ?? '';
    this.amount = st?.amount ?? 0;
    this.customerName = st?.customerName ?? '';
    this.showQR = this.payMethod === 'QR';

    if (this.showQR) {
      const promptpay = '0888884444'; // ✅ สามารถเปลี่ยนเป็นหมายเลขร้านใน env
      this.qrUrl = `https://promptpay.io/${promptpay}/${this.amount}`;
    }

    this.loadOrder();
  }

  loadOrder(): void {
    this.showOrderSvc.getOrderById(this.orderId).subscribe({
      next: (res) => {
        this.order = Array.isArray(res) ? res[0] : res;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

   simulatePayment(): void {
    if (!this.orderId) return;

    this.showOrderSvc.updateOrderStatus(this.orderId, 'waitcheckpay', 'paid').subscribe({
      next: () => {
        this.paidSuccess = true;
        // อัปเดตค่าภายในหน้าเพื่อให้ UI สะท้อนสถานะใหม่
        if (this.order) {
          this.order.status = 'waitcheckpay';
          this.order.payment_Status = 'paid';
        }
      },
      error: (err) => {
        console.error('อัปเดตสถานะไม่สำเร็จ:', err);
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      }
    });
  }
}


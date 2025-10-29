import { Component, OnInit } from '@angular/core';
import { ShowOrder, ShoworderService } from '../../services/showorder.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pf-3',
  templateUrl: './pf-3.component.html',
  styleUrl: './pf-3.component.css'
})
export class Pf3Component implements OnInit {
  orders: ShowOrder[] = [];
  groupedOrders: any[] = [];

  constructor(private showOrderService: ShoworderService,private router:Router) {}

  ngOnInit(): void {
    const status = 'musttransfer';  // สามารถเปลี่ยนค่า status ได้
    const userID = 1;          // เปลี่ยนเป็น userID ของผู้ใช้ที่ต้องการโหลดข้อมูล

    this.loadOrders(status, userID);
  }

  // ฟังก์ชันโหลดข้อมูลคำสั่งซื้อจาก API
  loadOrders(status: string, userID: number): void {
    this.showOrderService.getOrders(status, userID).subscribe({
      next: (data: ShowOrder[]) => {
        this.orders = data || [];
        this.groupOrdersById();  // เรียกฟังก์ชันกรุ๊ปข้อมูล
      },
      error: (err: any) => {
        console.error('Error loading orders:', err);
        this.orders = [];
      }
    });
  }

  // ฟังก์ชันกรุ๊ปข้อมูลโดย OrderID
  groupOrdersById(): void {
    const grouped: any[] = [];
    this.orders.forEach(order => {
      const existingOrder = grouped.find(o => o.orderID === order.orderID);
      if (existingOrder) {
        existingOrder.items.push(order);  // เพิ่ม OrderItem เข้าไปในรายการเดียวกัน
      } else {
        grouped.push({
          orderID: order.orderID,
          status: order.status,
          order_date: order.order_date,
          items: [order]  // สร้างรายการใหม่สำหรับ Order นี้
        });
      }
    });
    this.groupedOrders = grouped;
  }

  goToPfDetail(orderID: number) {
  if (!orderID) return;
  this.router.navigate(['/pf-detail', orderID]);
}

goToPaymentConfirm(): void {
    console.log("hello");
  }

  statusDisplayMap: { [key: string]: string } = {
  'waitpay': 'รอการชำระเงิน',
  'waitcheckpay': 'กำลังเตรียมพัสดุ',
  'musttransfer': 'กำลังเตรียมสินค้าจัดส่ง',
  'transfering': 'กำลังจัดส่งสินค้า',
  'mustreceive': 'ต้องได้รับสินค้า',
  'success': 'จัดส่งสำเร็จ',
  'cancel': 'ยกเลิกแล้ว',
  'return': 'คืนสินค้า',
  'failed': 'จัดส่งล้มเหลว'
};

  getDisplayStatus(status: string): string {
  return this.statusDisplayMap[status] || status;
}

paymentDisplayMap: { [key: string]: string } = {
  'QR': 'สแกนคิวอาร์โค้ด',
  'COD': 'ชำระเงินปลายทาง',
  'BANK': 'ชำระผ่านธนาคาร'
};

getPaymentDisplayStatus(method: string): string {
  return this.paymentDisplayMap[method] || method;
}
}
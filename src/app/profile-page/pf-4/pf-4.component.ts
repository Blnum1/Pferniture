import { Component, OnInit } from '@angular/core';
import { ShowOrder, ShoworderService } from '../../services/showorder.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pf-4',
  templateUrl: './pf-4.component.html',
  styleUrls: ['./pf-4.component.css']
})
export class Pf4Component implements OnInit {
  orders: ShowOrder[] = [];
  groupedOrders: any[] = [];

  // สำหรับ Modal
  isModalOpen = false;
  selectedOrderID: number | null = null;

  constructor(
    private showOrderService: ShoworderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const status = 'mustreceive'; // สถานะที่ต้องโหลด
    const userID = 1;             // เปลี่ยนตาม user ที่ login จริง
    this.loadOrders(status, userID);
  }

  // โหลดข้อมูลคำสั่งซื้อจาก API
  loadOrders(status: string, userID: number): void {
    this.showOrderService.getOrders(status, userID).subscribe({
      next: (data: ShowOrder[]) => {
        this.orders = data || [];
        this.groupOrdersById();
      },
      error: (err: any) => {
        console.error('Error loading orders:', err);
        this.orders = [];
      }
    });
  }

  // รวมออเดอร์ตาม orderID
  groupOrdersById(): void {
    const grouped: any[] = [];
    this.orders.forEach(order => {
      const existingOrder = grouped.find(o => o.orderID === order.orderID);
      if (existingOrder) {
        existingOrder.items.push(order);
      } else {
        grouped.push({
          orderID: order.orderID,
          status: order.status,
          order_date: order.order_date,
          items: [order]
        });
      }
    });
    this.groupedOrders = grouped;
  }

  // ไปหน้ารายละเอียดออเดอร์
  goToPfDetail(orderID: number) {
    if (!orderID) return;
    this.router.navigate(['/pf-detail', orderID]);
  }

  // แปลงชื่อสถานะเป็นภาษาไทย
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

  // แปลงชื่อวิธีการชำระเงิน
  paymentDisplayMap: { [key: string]: string } = {
    'QR': 'สแกนคิวอาร์โค้ด',
    'COD': 'ชำระเงินปลายทาง',
    'BANK': 'ชำระผ่านธนาคาร'
  };

  getPaymentDisplayStatus(method: string): string {
    return this.paymentDisplayMap[method] || method;
  }

  // ==========================
  // 🔹 Modal Function
  // ==========================

  // เปิด Modal ยืนยันการรับสินค้า
  openConfirmModal(orderID: number, event: MouseEvent) {
    event.stopPropagation();
    this.selectedOrderID = orderID;
    this.isModalOpen = true;
  }

  // ปิด Modal
  closeModal() {
    this.isModalOpen = false;
    this.selectedOrderID = null;
  }

  // เมื่อกดยืนยันรับสินค้า
  confirmReceived() {
    if (!this.selectedOrderID) return;

    this.showOrderService
      .updateOrderStatus(this.selectedOrderID, 'success', 'paid')
      .subscribe({
        next: () => {
          alert('ขอบคุณที่ยืนยันการรับสินค้า');
          this.closeModal();
          this.reloadOrders();
        },
        error: (err) => {
          console.error(err);
          alert('เกิดข้อผิดพลาดในการอัปเดต');
          this.closeModal();
        }
      });
  }

  // รีโหลดรายการคำสั่งซื้อใหม่
  reloadOrders() {
    const status = 'mustreceive';
    const userID = 1;
    this.loadOrders(status, userID);
  }
}

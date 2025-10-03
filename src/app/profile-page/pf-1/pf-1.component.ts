import { Component, OnInit } from '@angular/core';
import { ShowOrder, ShoworderService } from '../../services/showorder.service';

@Component({
  selector: 'app-pf-1',
  templateUrl: './pf-1.component.html',
  styleUrls: ['./pf-1.component.css']
})
export class Pf1Component implements OnInit {
  orders: ShowOrder[] = [];
  groupedOrders: any[] = [];

  constructor(private showOrderService: ShoworderService) {}

  ngOnInit(): void {
    const status = 'All';  // สามารถเปลี่ยนค่า status ได้
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
}

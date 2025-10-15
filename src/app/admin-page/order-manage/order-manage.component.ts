// import { Component, OnInit } from '@angular/core';
// import { ShoworderService } from './../../services/showorder.service';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-order-manage',
//   templateUrl: './order-manage.component.html',
//   styleUrls: ['./order-manage.component.css']
// })
// export class OrderManageComponent implements OnInit {
//   orders: any[] = [];  // เก็บรายการคำสั่งซื้อ
//   groupedOrders: any[] = [];  // เก็บคำสั่งซื้อที่ถูกจัดกลุ่ม
//   status: string = 'All';  // ค่าเริ่มต้นสำหรับสถานะ
//   isPrintPopupOpen: boolean = false;
//   selectedOrder: any;
  
//   constructor(private ShoworderService: ShoworderService, private http: HttpClient, private router: Router) { }

//   ngOnInit(): void {
//     this.loadOrders();
//   }

//   loadOrders(): void {
//     this.ShoworderService.getAllOrders(this.status).subscribe({
//       next: (data) => {
//         console.log('Fetched orders:', data);  // เช็คข้อมูลที่ได้รับจาก API
//         this.orders = data;
//         this.groupOrders();  // เรียกใช้การจัดกลุ่มคำสั่งซื้อ
//       },
//       error: (err) => {
//         console.error('Error fetching orders', err);
//       }
//     });
//   }

//   groupOrders(): void {
//     const grouped: any[] = [];
//     this.orders.forEach((order) => {
//       const orderGroup = grouped.find(group => group.orderID === order.orderID);
//       if (orderGroup) {
//         orderGroup.items.push(order);  // เพิ่ม item ลงในกลุ่มที่มี orderID เดียวกัน
//       } else {
//         grouped.push({
//           orderID: order.orderID,
//           order_date: order.order_date,
//           status: order.status,
//           items: [order]  // สร้างกลุ่มใหม่
//         });
//       }
//     });
//     this.groupedOrders = grouped;
//   }
//   updateStatus(orderID: number, orderStatus: string, paymentStatus: string) {
//     this.ShoworderService.updateOrderStatus(orderID, orderStatus, paymentStatus).subscribe({
//       next: (response) => {
//         console.log('Status updated successfully', response);
//         // รีเฟรชข้อมูลหรืออัพเดต UI ตามที่ต้องการ
//         this.loadOrders(); // รีเฟรชรายการคำสั่งซื้อ
//       },
//       error: (err) => {
//         console.error('Error updating status', err);
//       }
//     });
//   }

//    printOrder(orderGroup: any): void {
//     this.router.navigate(['/delivery-note', orderGroup.orderID]);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ShoworderService } from './../../services/showorder.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-manage',
  templateUrl: './order-manage.component.html',
  styleUrls: ['./order-manage.component.css']
})
export class OrderManageComponent implements OnInit {
  orderID!: number;
  orders: any[] = [];
  groupedOrders: Array<{
    orderID: number;
    order_date: string;
    status: string;
    items: any[];
  }> = [];

  // ฟิลเตอร์ (แถบด้านบน)
  filterDateFrom?: string;
  filterDateTo?: string;
  filterOrderId?: string;

  constructor(
    private route: ActivatedRoute,
    private showorderService: ShoworderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ถ้าเปิดจากหน้าอ้างอิง orderId
    const id = this.route.snapshot.paramMap.get('orderID');
    this.orderID = id ? +id : 0;
    this.loadOrderDetails();
  }

  loadOrderDetails(): void {
    // ถ้ามี orderID ระบุ มาใช้ API by ID; ถ้าไม่มีก็แล้วแต่คุณจะดึงแบบทั้งหมด
    if (this.orderID) {
      this.showorderService.getOrderById(this.orderID).subscribe({
        next: (data) => {
          this.orders = data || [];
          this.groupOrders();
        },
        error: (e) => console.error(e)
      });
    } else {
      // ตัวอย่าง: ดึงทั้งหมดสถานะ “ทั้งหมด”
      this.showorderService.getAllOrders('ALL').subscribe({
        next: (data) => {
          this.orders = data || [];
          this.groupOrders();
        },
        error: (e) => console.error(e)
      });
    }
  }

  groupOrders(): void {
    const grouped: any[] = [];
    this.orders.forEach((o) => {
      const g = grouped.find((x) => x.orderID === o.orderID);
      if (g) {
        g.items.push(o);
      } else {
        grouped.push({
          orderID: o.orderID,
          order_date: o.order_date,
          status: o.status,
          items: [o]
        });
      }
    });
    this.groupedOrders = grouped;
  }

  // นับจำนวนตามสถานะสำหรับ badge
  getCount(status: 'ALL' | 'TO_SHIP' | 'SHIPPING' | 'SUCCESS' | 'CANCEL' | 'RETURN' | 'FAILED') {
    if (status === 'ALL') return this.groupedOrders.length;
    return this.groupedOrders.filter(g => (g.status || '').toUpperCase() === status).length;
  }

  getGroupTotal(group: { items: any[] }) {
    return group.items?.reduce((sum, i) => sum + Number(i.quantity) * Number(i.price_Amount ?? i.priceAmount ?? 0), 0) || 0;
  }

  mapStatus(s: string) {
    const k = (s || '').toUpperCase();
    switch (k) {
      case 'TO_SHIP': return 'ต้องจัดส่ง';
      case 'SHIPPING': return 'กำลังจัดส่ง';
      case 'SUCCESS': return 'สำเร็จ';
      case 'CANCEL': return 'ยกเลิก';
      case 'RETURN': return 'คืนสินค้า/คืนเงิน';
      case 'FAILED': return 'จัดส่งไม่สำเร็จ';
      case 'WAITPAY': return 'รอการชำระเงิน'; 
      default: return '—';
    }
  }

  mapShipMethod(m?: string) {
    if (!m) return '';
    const k = m.toUpperCase();
    if (k.includes('EXPRESS')) return 'ส่งด่วนทันใจ - ในประเทศ';
    if (k.includes('STANDARD')) return 'ส่งมาตรฐาน - ในประเทศ';
    if (k.includes('PICKUP')) return 'รับสินค้าเองที่สาขา';
    return m;
  }

  // ปุ่ม “จัดส่งสินค้า”
  goToShip(group: any) {
    window.print();
  }
  printOrder(orderGroup: any): void {
     this.router.navigate(['/order-manage-detail', orderGroup.orderID]);
  }

  // ฟิลเตอร์ (จำลองง่าย ๆ ที่ฝั่ง client)
  applyFilter() {
    // ในงานจริงควรส่งพารามิเตอร์ไป query จาก API
    let temp = [...this.orders];

    if (this.filterOrderId && this.filterOrderId.trim()) {
      temp = temp.filter(o => String(o.orderID).includes(this.filterOrderId!.trim()));
    }
    if (this.filterDateFrom) {
      const from = new Date(this.filterDateFrom);
      temp = temp.filter(o => new Date(o.order_date) >= from);
    }
    if (this.filterDateTo) {
      const to = new Date(this.filterDateTo);
      temp = temp.filter(o => new Date(o.order_date) <= to);
    }

    // regroup
    this.orders = temp;
    this.groupOrders();
  }

  clearFilter() {
    this.filterDateFrom = this.filterDateTo = this.filterOrderId = undefined;
    this.loadOrderDetails();
  }
}
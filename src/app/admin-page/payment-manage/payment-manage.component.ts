import { Component, OnInit } from '@angular/core';
import { ShoworderService } from '../../services/showorder.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-manage',
  templateUrl: './payment-manage.component.html',
  styleUrl: './payment-manage.component.css'
})
export class PaymentManageComponent implements OnInit {
  orderID!: number;
  orders: any[] = [];
  allOrders: any[] = []; // เก็บข้อมูลทั้งหมดสำหรับ filter
  selectedOrder: any;  
  isModalOpen: boolean = false; 
  groupedOrders: Array<{
    orderID: number;
    order_date: string;
    status: string;
    items: any[];
  }> = [];

  // ฟิลเตอร์
  filterDateFrom?: string;
  filterDateTo?: string;
  filterOrderId?: string;
  activeTab: string = 'ALL'; // เก็บสถานะแท็บที่เลือก

  constructor(
    private route: ActivatedRoute,
    private showorderService: ShoworderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('orderID');
    this.orderID = id ? +id : 0;
    this.loadOrderDetails();
  }

  loadOrderDetails(): void {
    if (this.orderID) {
      this.showorderService.getOrderById(this.orderID).subscribe({
        next: (data) => {
          this.allOrders = data || [];
          this.orders = [...this.allOrders];
          console.log('Orders loaded:', this.orders); 
          this.filterPaymentStatuses();
          this.groupOrders();
        },
        error: (e) => console.error('Error loading order:', e)
      });
    } else {
      this.showorderService.getAllOrders('ALL').subscribe({
        next: (data) => {
          this.allOrders = data || [];
          this.orders = [...this.allOrders];
          console.log('All orders loaded:', this.orders); 
          this.filterPaymentStatuses();
          this.groupOrders();
        },
        error: (e) => console.error('Error loading orders:', e)
      });
    }
  }

  /**
   * กรองเฉพาะสถานะที่เกี่ยวกับการชำระเงิน
   */
  filterPaymentStatuses(): void {
    const paymentStatuses = ['waitpay', 'waitcheckpay', 'paid'];
    this.orders = this.orders.filter(o => {
      if (!o.status) return false;
      const status = o.status.toLowerCase();
      return paymentStatuses.includes(status);
    });
    console.log('Filtered payment orders:', this.orders);
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
    console.log('Grouped orders:', this.groupedOrders);
  }

  /**
   * กรองข้อมูลตามสถานะที่เลือกจากแท็บ
   */
  filterByStatus(status: string): void {
    this.activeTab = status;
    
    let temp = [...this.allOrders];
    
    // กรองเฉพาะสถานะการชำระเงิน
    const paymentStatuses = ['waitpay', 'waitcheckpay', 'paid'];
    temp = temp.filter(o => {
      if (!o.status) return false;
      const statusLower = o.status.toLowerCase();
      return paymentStatuses.includes(statusLower);
    });
    
    // ถ้าไม่ใช่ ALL ให้กรองตามสถานะที่เลือก
    if (status !== 'ALL') {
      temp = temp.filter(o => 
        (o.status || '').toUpperCase() === status
      );
    }
    
    // นำฟิลเตอร์อื่นๆ มาใช้ด้วย (OrderID, วันที่)
    if (this.filterOrderId && this.filterOrderId.trim()) {
      temp = temp.filter(o => 
        String(o.orderID).includes(this.filterOrderId!.trim())
      );
    }
    
    if (this.filterDateFrom) {
      const from = new Date(this.filterDateFrom);
      from.setHours(0, 0, 0, 0);
      temp = temp.filter(o => {
        const orderDate = new Date(o.order_date);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate >= from;
      });
    }
    
    if (this.filterDateTo) {
      const to = new Date(this.filterDateTo);
      to.setHours(23, 59, 59, 999);
      temp = temp.filter(o => {
        const orderDate = new Date(o.order_date);
        return orderDate <= to;
      });
    }
    
    this.orders = temp;
    this.groupOrders();
  }

  // นับจำนวนตามสถานะสำหรับ badge (นับจาก allOrders ไม่ใช่ groupedOrders)
  getCount(status: 'ALL' | 'WAITPAY' | 'WAITCHECKPAY' | 'PAID'): number {
    // กรองเฉพาะสถานะการชำระเงิน
    const paymentStatuses = ['waitpay', 'waitcheckpay', 'paid'];
    let filteredOrders = this.allOrders.filter(o => {
      if (!o.status) return false;
      const statusLower = o.status.toLowerCase();
      return paymentStatuses.includes(statusLower);
    });

    // จัดกลุ่ม orders ตาม orderID
    const grouped: any[] = [];
    filteredOrders.forEach((o) => {
      const g = grouped.find((x) => x.orderID === o.orderID);
      if (g) {
        g.items.push(o);
      } else {
        grouped.push({
          orderID: o.orderID,
          status: o.status,
          items: [o]
        });
      }
    });

    // นับทั้งหมด
    if (status === 'ALL') return grouped.length;
    
    // นับตามสถานะเฉพาะ
    return grouped.filter(g => 
      (g.status || '').toUpperCase() === status
    ).length;
  }

  getGroupTotal(group: { items: any[] }): number {
    if (!group || !group.items || group.items.length === 0) return 0;
    return group.items.reduce((sum, i) => {
      const quantity = Number(i.quantity) || 0;
      const price = Number(i.price_Amount ?? i.priceAmount ?? 0);
      return sum + (quantity * price);
    }, 0);
  }

  mapStatus(s: string): string {
    if (!s) return '—';
    const k = s.toUpperCase();
    switch (k) {
      case 'WAITPAY': return 'รอการชำระเงิน'; 
      case 'WAITCHECKPAY': return 'ชำระเงินรอตรวจสอบ'; 
      case 'PAID': return 'ชำระเงินแล้ว';
      default: return s;
    }
  }

  mapShipMethod(m?: string): string {
    if (!m) return 'ส่งด่วนทันใจ - ในประเทศ';
    const k = m.toUpperCase();
    if (k.includes('EXPRESS')) return 'ส่งด่วนทันใจ - ในประเทศ';
    if (k.includes('STANDARD')) return 'ส่งมาตรฐาน - ในประเทศ';
    if (k.includes('PICKUP')) return 'รับสินค้าเองที่สาขา';
    return m;
  }

  goToShip(group: any): void {
    window.print();
  }

  applyFilter(): void {
    let temp = [...this.allOrders];

    // กรองเฉพาะสถานะการชำระเงิน
    const paymentStatuses = ['waitpay', 'waitcheckpay', 'paid'];
    temp = temp.filter(o => {
      if (!o.status) return false;
      const status = o.status.toLowerCase();
      return paymentStatuses.includes(status);
    });

    // กรองตามแท็บที่เลือก
    if (this.activeTab !== 'ALL') {
      temp = temp.filter(o => 
        (o.status || '').toUpperCase() === this.activeTab
      );
    }

    // กรองตาม OrderID
    if (this.filterOrderId && this.filterOrderId.trim()) {
      temp = temp.filter(o => 
        String(o.orderID).includes(this.filterOrderId!.trim())
      );
    }

    // กรองตามวันที่เริ่มต้น
    if (this.filterDateFrom) {
      const from = new Date(this.filterDateFrom);
      from.setHours(0, 0, 0, 0);
      temp = temp.filter(o => {
        const orderDate = new Date(o.order_date);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate >= from;
      });
    }

    // กรองตามวันที่สิ้นสุด
    if (this.filterDateTo) {
      const to = new Date(this.filterDateTo);
      to.setHours(23, 59, 59, 999);
      temp = temp.filter(o => {
        const orderDate = new Date(o.order_date);
        return orderDate <= to;
      });
    }

    this.orders = temp;
    this.groupOrders();
  }

  clearFilter(): void {
    this.filterDateFrom = undefined;
    this.filterDateTo = undefined;
    this.filterOrderId = undefined;
    this.activeTab = 'ALL'; // รีเซ็ตแท็บกลับไปที่ทั้งหมด
    this.orders = [...this.allOrders];
    this.filterPaymentStatuses();
    this.groupOrders();
  }
  
  openModal(group: any): void {
    this.selectedOrder = group;
    console.log('Selected order for modal:', this.selectedOrder);
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedOrder = null;
  }

  confirmShipping(): void {
    if (this.selectedOrder && this.selectedOrder.orderID) {
      console.log('Confirming shipping for order:', this.selectedOrder.orderID);
      this.updateOrderStatus(this.selectedOrder.orderID, 'musttransfer', 'paid');
    } else {
      console.error('No order selected or orderID is missing');
    }
  }

  updateOrderStatus(orderID: number, orderStatus: string, paymentStatus: string): void {
    this.showorderService.updateOrderStatus(orderID, orderStatus, paymentStatus).subscribe({
      next: () => {
        console.log('สถานะออเดอร์ถูกอัปเดตเรียบร้อยแล้ว');
        this.closeModal();
        this.loadOrderDetails();
      },
      error: (e) => {
        console.error('Error updating order status:', e);
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      }
    });
  }
}
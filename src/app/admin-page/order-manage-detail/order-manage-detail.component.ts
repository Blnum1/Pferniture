import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoworderService } from '../../services/showorder.service';

@Component({
  selector: 'app-order-manage-detail',
  templateUrl: './order-manage-detail.component.html',
  styleUrl: './order-manage-detail.component.css'
})
export class OrderManageDetailComponent implements OnInit {
  selectedOrder: any;
  orderID!: number;
  orders: any[] = [];
  groupedOrders: any[] = [];

  // เก็บข้อมูลกลุ่มเดียวที่จะนำไปใช้ใน template
  orderGroup: any;
  selectedShipper: string = '';
  isUpdating: boolean = false; // สำหรับแสดง loading state

  // รายชื่อบริษัทขนส่ง
  shippers = [
    { id: 'flash', name: 'Flash Express', logo: 'assets/image/flash-express-logo.png' },
    { id: 'dhl', name: 'Kerry Express', logo: 'assets/image/dhl-Logo.png' },
    { id: 'jt', name: 'J&T Express', logo: 'assets/image/jnt-logo.png' },
    { id: 'thpost', name: 'ไปรษณีย์ไทย', logo: 'assets/image/th-post-logo.png' }
  ];

  constructor(
    private route: ActivatedRoute,
    private showorderService: ShoworderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.orderID = +this.route.snapshot.paramMap.get('orderID')!;
    this.loadOrderDetails();
  }

  loadOrderDetails(): void {
    this.showorderService.getOrderById(this.orderID)
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.orders = data;
            this.groupOrders();
          }
        },
        error: (err) => {
          console.error('Error fetching order details:', err);
          alert('เกิดข้อผิดพลาดในการโหลดข้อมูลคำสั่งซื้อ');
        }
      });
  }

  groupOrders(): void {
    const grouped: any[] = [];

    this.orders.forEach((order) => {
      order.quantity = parseFloat(order.quantity);
      order.price_Amount = parseFloat(order.price_Amount);
      order.payment_Amount = parseFloat(order.payment_Amount);
      const orderGroup = grouped.find(group => group.orderID === order.orderID);

      if (orderGroup) {
        orderGroup.items.push(order);
      } else {
        grouped.push({
          orderID: order.orderID,
          order_date: order.order_date,
          status: order.status,
          items: [order]
        });
      }
    });

    this.groupedOrders = grouped;

    // กำหนดให้ orderGroup เป็นกลุ่มแรก (ซึ่งควรจะเป็นกลุ่มเดียว)
    if (this.groupedOrders.length > 0) {
      this.orderGroup = this.groupedOrders[0];
    }
  }

  confirmAndPrint(): void {
    // ตรวจสอบว่าเลือกขนส่งแล้วหรือยัง
    if (!this.selectedShipper) {
      alert('กรุณาเลือกบริษัทขนส่ง');
      return;
    }

    // ตรวจสอบว่ามี orderGroup หรือไม่
    if (!this.orderGroup || !this.orderGroup.orderID) {
      alert('ไม่พบข้อมูลคำสั่งซื้อ');
      return;
    }

    // แสดง loading state
    this.isUpdating = true;

    // เรียกใช้ service เพื่ออัปเดตสถานะ
    this.showorderService.updateOrderStatus(
      this.orderGroup.orderID,
      'transfering',  // OrderStatus
      'paid'           // PaymentStatus (สมมติว่าชำระเงินแล้ว)
    ).subscribe({
      next: (response) => {
        console.log('อัปเดตสถานะสำเร็จ:', response);
        this.isUpdating = false;

        // นำทางไปหน้าใบส่งสินค้าพร้อม query params
        this.router.navigate(['/delivery-note', this.orderGroup.orderID], {
          queryParams: { 
            autoPrint: true, 
            shipper: this.selectedShipper 
          }
        });
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        this.isUpdating = false;
        
        // แสดงข้อความ error ที่เป็นมิตร
        let errorMessage = 'เกิดข้อผิดพลาดในการอัปเดตสถานะคำสั่งซื้อ';
        
        if (error.error && error.error.message) {
          errorMessage += ': ' + error.error.message;
        }
        
        alert(errorMessage);
      }
    });
  }

  // ฟังก์ชันสำรองเผื่อต้องการยกเลิก
  cancelOrder(): void {
    if (confirm('ต้องการยกเลิกคำสั่งซื้อนี้หรือไม่?')) {
      this.showorderService.updateOrderStatus(
        this.orderGroup.orderID,
        'cancel',
        this.orderGroup.items[0]?.payment_Status || 'unpaid'
      ).subscribe({
        next: () => {
          alert('ยกเลิกคำสั่งซื้อสำเร็จ');
          this.router.navigate(['/order-management']);
        },
        error: (error) => {
          console.error('Error canceling order:', error);
          alert('เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ');
        }
      });
    }
  }
}
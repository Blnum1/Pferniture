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

  // 💡 เพิ่ม Property นี้เพื่อเก็บข้อมูลกลุ่มเดียวที่จะนำไปใช้ใน template
  orderGroup: any;
  selectedShipper: string = '';

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

    // 💡 กำหนดให้ orderGroup เป็นกลุ่มแรก (ซึ่งควรจะเป็นกลุ่มเดียว)
    if (this.groupedOrders.length > 0) {
      this.orderGroup = this.groupedOrders[0];
    }
  }

  confirmAndPrint(): void {
    if (!this.selectedShipper) return;
    alert(`เลือกขนส่ง: ${this.selectedShipper}`);

    // ไปหน้าใบส่งสินค้า + autoPrint
    this.router.navigate([`/delivery-note`, this.orderGroup.orderID], {
      queryParams: { autoPrint: true, shipper: this.selectedShipper }
    });
  }
}
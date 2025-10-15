import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private showorderService: ShoworderService
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

  print(): void {
    setTimeout(() => {
      window.print();
    }, 100);
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItemDto } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CreateOrderRequest, PayMethod } from '../../models/order.dto';
import { ShippingInfoService } from '../../services/shipping-info.service';
import { CartService } from '../../services/cart.service';

type ShipMethod = 'ในประเทศ' | 'ด่วนพิเศษ';

type UiShipping = {
  id: number;
  address: string;
  city?: string;
  region?: string;
  postal?: number | string;
  phone?: string;
  raw?: any;
};

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  cartID!: number;
  items: CartItemDto[] = [];
  subtotal = 0;

  userId!: number;
  customerName = '';
  phone = '';

  shippingList: UiShipping[] = [];
  selectedShippingId: number | null = null;

  shipMethod: ShipMethod = 'ในประเทศ';
  shippingFee = 0;
  coupon = '';
  discount = 0;
  payMethod: PayMethod = 'QR';
  bankNote = '';

  loading = false;
  errorMsg = '';
  success = false;

  showSelectModal = false;
  tempSelectedShippingId: number | null = null;

  showAddModal = false;
  addSubmitting = false;
  addError = '';
  newAddr = { house: '', subdistrict: '', district: '', province: '', postal: '', note: '' };

  constructor(
    private router: Router,
    private orderSvc: OrderService,
    private authSvc: AuthService,
    private shipSvc: ShippingInfoService,
    private cartSvc: CartService
  ) {}

  ngOnInit(): void {
    const st: any = history.state;
    if (!st?.items?.length || !st?.cartID) {
      this.router.navigate(['/cart']);
      return;
    }
    this.cartID = st.cartID;
    this.items = st.items as CartItemDto[];
    this.subtotal = st.subtotal ?? this.items.reduce((s, i) => s + i.price_amount * i.quantity, 0);

    this.authSvc.loadCurrentUser();
    const u = this.authSvc.currentUser.value;
    if (u) {
      this.userId = u.userID ?? u.id ?? 0;
      this.customerName = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim();
      this.phone = u.phone ?? '';
    }

    if (this.userId) this.fetchShippingList(this.userId);
  }

  private normalizeApiItem(item: any): UiShipping {
    const id = item?.ShippingInfoID ?? item?.shippingInfoID ?? item?.id ?? item?.ShippingId ?? null;
    const address = (item?.Address ?? item?.address ?? '').toString().trim();
    const city = item?.City ?? item?.city;
    const region = item?.Region ?? item?.region;
    const postal = item?.Postal_Code ?? item?.postal_Code ?? item?.postal ?? item?.PostalCode;
    const phone = item?.Shipping_Phone ?? item?.shipping_Phone ?? item?.phone;
    return {
      id: Number(id),
      address,
      city,
      region,
      postal,
      phone,
      raw: item
    };
  }

  fetchShippingList(userId: number) {
    this.shipSvc.getUserShippings(userId).subscribe({
      next: (list: any[]) => {
        const arr = (list ?? []).map(i => this.normalizeApiItem(i)).filter(x => Number.isFinite(x.id));
        this.shippingList = arr;
        if (!this.selectedShippingId && this.shippingList.length > 0) {
          const first = this.shippingList[0];
          this.selectedShippingId = first.id;
          this.onChangeShip(first?.region === 'ด่วนพิเศษ' ? 'ด่วนพิเศษ' : 'ในประเทศ');
        }
      },
      error: () => (this.errorMsg = 'โหลดที่อยู่จัดส่งไม่สำเร็จ')
    });
  }

  onShippingChange(ev: any) {
    this.selectedShippingId = (ev === null || ev === undefined) ? null : Number(ev);
  }

  get selectedShipping(): UiShipping | undefined {
    return this.shippingList.find(s => s.id === (this.selectedShippingId ?? -1));
  }

  onChangeShip(m: ShipMethod) {
    this.shipMethod = m;
    this.shippingFee = m === 'ในประเทศ' ? 0 : 0;
  }

  applyCoupon() {
    this.discount = this.coupon.trim().toUpperCase() === 'SAVE50' ? 50 : 0;
  }

  get grandTotal(): number {
    return Math.max(0, this.subtotal + this.shippingFee - this.discount);
  }

  placeOrder(): void {
  if (this.selectedShippingId === null) {
    this.errorMsg = 'กรุณาเลือกที่อยู่จัดส่ง';
    return;
  }

  const sid = Number(this.selectedShippingId);
  if (!Number.isFinite(sid) || sid <= 0) {
    this.errorMsg = 'กรุณาเลือกที่อยู่จัดส่ง';
    return;
  }

  if (!this.userId) {
    this.errorMsg = 'กรุณาเข้าสู่ระบบก่อนสั่งซื้อ';
    return;
  }

  this.errorMsg = '';
  this.loading = true;

  // สร้าง payload ที่จะส่งไปยัง API
  const payload = {
    cartID: this.cartID,
    userID: this.userId,
    shippingInfoID: sid,
    payment: {
      payment_Method: this.payMethod,
      payment_Status: 'Pending',
      payment_date: new Date().toISOString(),
      payment_Amount: this.grandTotal
    },
    status: 'waitpay',
    order_date: new Date().toISOString(),
    // เพิ่ม cartItems ที่ประกอบไปด้วย CartItemID และ Quantity
    cartItems: this.items
      .filter(item => item.selected)  // เลือกเฉพาะสินค้าที่ถูกเลือก
      .map(item => ({
        cartItemID: item.cartItemID,  // ส่ง CartItemID
        quantity: item.quantity       // ส่ง Quantity
      }))
  };

  // เรียก API เพื่อสร้าง Order
  this.orderSvc.createOrderFromCart(payload).subscribe({
    next: (res: any) => {
      const newCartId = res?.newCartID ?? res?.newCartId ?? res?.new_cart_id;
      if (newCartId) {
        this.cartSvc.setCurrentCartId(Number(newCartId));  // ตั้งค่า CartID ใหม่
      }
      this.loading = false;
      this.success = true;
      this.router.navigate(['/order/success'], { state: { orderId: res?.orderID } });
    },
    error: err => {
      this.loading = false;
      this.errorMsg = err?.error ?? 'สั่งซื้อไม่สำเร็จ';
    }
  });
}



  openSelectAddress() {
    if (!this.selectedShippingId && this.shippingList.length) {
      this.selectedShippingId = this.shippingList[0].id;
    }
    this.tempSelectedShippingId = this.selectedShippingId ?? null;
    this.showSelectModal = true;
  }

  selectTemp(id: number) {
    this.tempSelectedShippingId = id;
  }

  closeSelectAddress() { this.showSelectModal = false; }

  confirmSelectAddress() {
    if (this.tempSelectedShippingId !== null) {
      this.selectedShippingId = this.tempSelectedShippingId;
    }
    this.closeSelectAddress();
  }

  openAddAddress() {
    this.addError = '';
    this.newAddr = { house: '', subdistrict: '', district: '', province: '', postal: '', note: '' };
    this.showAddModal = true;
  }

  closeAddAddress() { if (!this.addSubmitting) this.showAddModal = false; }

  saveNewAddress() {
    if (!this.newAddr.house.trim()) { this.addError = 'กรุณากรอกบ้านเลขที่/ถนน'; return; }
    if (!this.newAddr.district.trim() || !this.newAddr.province.trim()) { this.addError = 'กรุณากรอก อำเภอ และ จังหวัด'; return; }

    const dto = {
      UserID: this.userId,
      Address: this.newAddr.house + (this.newAddr.subdistrict ? `, ต.${this.newAddr.subdistrict}` : ''),
      City: this.newAddr.district,
      Region: this.newAddr.province,
      Country: 'TH',
      Postal_Code: this.newAddr.postal ? Number(this.newAddr.postal) : undefined,
      Shipping_Method: this.shipMethod,
      Shipping_Phone: this.phone || ''
    };

    this.addSubmitting = true;
    this.shipSvc.createShipping(dto).subscribe({
      next: (created: any) => {
        const ui = this.normalizeApiItem(created);
        this.shippingList.unshift(ui);
        this.tempSelectedShippingId = ui.id;
        this.addSubmitting = false;
        this.showAddModal = false;
      },
      error: err => {
        this.addSubmitting = false;
        this.addError = err?.error ?? 'บันทึกไม่สำเร็จ';
      }
    });
  }
}

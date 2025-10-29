import { Component, OnInit } from '@angular/core';
import { ShippingInfoService } from '../../services/shipping-info.service';
import { AuthService } from '../../services/auth.service';

type UiShipping = {
  id: number;
  address: string;
  city?: string;
  region?: string;
  postal?: number | string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  raw?: any;
};

type ShipMethod = 'ในประเทศ' | 'ด่วนพิเศษ';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  // ---- user context ----
  userId!: number;
  phone = '';
  shipMethod: ShipMethod = 'ในประเทศ';

  // ---- list & UI state ----
  shippingList: UiShipping[] = [];
  loading = false;
  loadError = '';

  // ---- add modal ----
  showAddModal = false;
  addSubmitting = false;
  addError = '';
  newAddr = {
    house: '',
    subdistrict: '',
    district: '',
    province: '',
    postal: '',
    note: '',
    firstName: '',
    lastName: '',
    phone: ''
  };

  editing: {
    id: number;
    house: string;
    subdistrict: string;
    district: string;
    province: string;
    postal: string;
    firstName: string;
    lastName: string;
    phone: string;
  } | null = null;

  showEditModal = false;
  editSubmitting = false;
  editError = '';

  constructor(
    private shipSvc: ShippingInfoService,
    private authSvc: AuthService
  ) { }

  ngOnInit(): void {
    // ดึง user ปัจจุบัน
    this.authSvc.loadCurrentUser();
    const u = this.authSvc.currentUser.value;
    if (u) {
      this.userId = u.userID ?? u.id ?? 0;
      this.phone = u.phone ?? '';
    }
    if (this.userId) this.fetchShippingList(this.userId);
  }

  // ---------- helpers ----------
  private normalizeApiItem(item: any): UiShipping {
    const id = item?.ShippingInfoID ?? item?.shippingInfoID ?? item?.id ?? item?.ShippingId ?? null;
    const address = (item?.Address ?? item?.address ?? '').toString().trim();
    const city = item?.City ?? item?.city;
    const region = item?.Region ?? item?.region;
    const postal = item?.Postal_Code ?? item?.postal_Code ?? item?.postal ?? item?.PostalCode;
    const phone = item?.Shipping_Phone ?? item?.shipping_Phone ?? item?.phone;
    
    // เพิ่มการดึง firstName และ lastName
    const firstName = item?.FirstName ?? item?.firstName ?? item?.first_name ?? '';
    const lastName = item?.LastName ?? item?.lastName ?? item?.last_name ?? '';
    
    return { 
      id: Number(id), 
      address, 
      city, 
      region, 
      postal, 
      phone, 
      firstName,
      lastName,
      raw: item 
    };
  }

  // ---------- fetch list ----------
  fetchShippingList(userId: number) {
    this.loading = true;
    this.loadError = '';
    this.shipSvc.getUserShippings(userId).subscribe({
      next: (list: any[]) => {
        this.shippingList = (list ?? [])
          .map(i => this.normalizeApiItem(i))
          .filter(x => Number.isFinite(x.id));
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.loadError = err?.error ?? 'โหลดที่อยู่จัดส่งไม่สำเร็จ';
      }
    });
  }

  // ---------- add modal ----------
  openAddAddress() {
    this.addError = '';
    this.newAddr = {
      house: '',
      subdistrict: '',
      district: '',
      province: '',
      postal: '',
      note: '',
      firstName: '',
      lastName: '',
      phone: this.phone || '' // ใช้เบอร์ user เป็นค่า default
    };
    this.showAddModal = true;
  }

  closeAddAddress() {
    if (!this.addSubmitting) this.showAddModal = false;
  }

  saveNewAddress() {
    if (!this.newAddr.house.trim()) {
      this.addError = 'กรุณากรอกบ้านเลขที่/ถนน';
      return;
    }
    if (!this.newAddr.district.trim() || !this.newAddr.province.trim()) {
      this.addError = 'กรุณากรอก อำเภอ และ จังหวัด';
      return;
    }
    if (!this.newAddr.firstName.trim() || !this.newAddr.lastName.trim()) {
      this.addError = 'กรุณากรอกชื่อและนามสกุล';
      return;
    }
    if (!this.newAddr.phone.trim()) {
      this.addError = 'กรุณากรอกเบอร์โทร';
      return;
    }

    const dto = {
      UserID: this.userId,
      Address: this.newAddr.house + (this.newAddr.subdistrict ? `, ต.${this.newAddr.subdistrict}` : ''),
      City: this.newAddr.district,
      Region: this.newAddr.province,
      Country: 'TH',
      Postal_Code: this.newAddr.postal ? Number(this.newAddr.postal) : undefined,
      Shipping_Method: this.shipMethod,
      Shipping_Phone: this.newAddr.phone,
      FirstName: this.newAddr.firstName,
      LastName: this.newAddr.lastName
    };

    this.addSubmitting = true;
    this.shipSvc.createShipping(dto).subscribe({
      next: (created: any) => {
        const ui = this.normalizeApiItem(created);
        this.shippingList.unshift(ui);
        this.addSubmitting = false;
        this.showAddModal = false;
      },
      error: err => {
        this.addSubmitting = false;
        this.addError = err?.error ?? 'บันทึกไม่สำเร็จ';
      }
    });
  }

  private splitAddress(address: string): { house: string; subdistrict: string } {
    // แยก "..., ต.xxx" ออกจาก house
    const m = (address ?? '').match(/^(.*?)(?:,\s*ต\.(.*))?$/);
    return {
      house: (m?.[1] || '').trim(),
      subdistrict: (m?.[2] || '').trim()
    };
  }

  private buildAddress(house: string, subdistrict: string): string {
    return house.trim() + (subdistrict.trim() ? `, ต.${subdistrict.trim()}` : '');
  }

  // ==== เปิด popup แก้ไข ====
  openEditAddress(item: UiShipping) {
    this.editError = '';
    this.editSubmitting = false;

    // ดึงข้อมูลล่าสุดกันข้อมูลเก่า/ไม่ครบ
    this.shipSvc.getShipping(item.id, this.userId).subscribe({
      next: (s) => {
        const ui = this.normalizeApiItem(s);
        const { house, subdistrict } = this.splitAddress(ui.address);

        this.editing = {
          id: ui.id,
          house,
          subdistrict,
          district: ui.city ?? '',
          province: ui.region ?? '',
          postal: (ui.postal ?? '').toString(),
          phone: ui.phone ?? '',
          firstName: ui.firstName ?? '',
          lastName: ui.lastName ?? ''
        };
        
        console.log('Editing data:', this.editing); // Debug log
        this.showEditModal = true;
      },
      error: err => {
        this.editError = err?.error ?? 'โหลดข้อมูลที่อยู่ไม่สำเร็จ';
        alert(this.editError);
      }
    });
  }

  // ==== ปิด popup แก้ไข ====
  closeEditAddress() {
    if (!this.editSubmitting) {
      this.showEditModal = false;
      this.editing = null;
    }
  }

  // ==== บันทึกการแก้ไข ====
  saveEditAddress() {
    if (!this.editing) return;

    const e = this.editing;
    if (!e.house.trim()) {
      this.editError = 'กรุณากรอกบ้านเลขที่/ถนน';
      return;
    }
    if (!e.district.trim() || !e.province.trim()) {
      this.editError = 'กรุณากรอก อำเภอ และ จังหวัด';
      return;
    }
    if (!e.firstName.trim() || !e.lastName.trim()) {
      this.editError = 'กรุณากรอกชื่อและนามสกุล';
      return;
    }
    if (!e.phone.trim()) {
      this.editError = 'กรุณากรอกเบอร์โทร';
      return;
    }

    const dto = {
      Address: this.buildAddress(e.house, e.subdistrict),
      City: e.district,
      Region: e.province,
      Country: 'TH',
      Postal_Code: e.postal ? Number(e.postal) : undefined,
      Shipping_Method: this.shipMethod,
      Shipping_Phone: e.phone,
      FirstName: e.firstName,
      LastName: e.lastName
    };

    console.log('Updating with:', dto); // Debug log

    this.editSubmitting = true;
    this.shipSvc.updateShipping(e.id, this.userId, dto).subscribe({
      next: (updated) => {
        // อัปเดตในลิสต์ทันที
        const idx = this.shippingList.findIndex(x => x.id === e.id);
        if (idx > -1) this.shippingList[idx] = this.normalizeApiItem(updated);
        this.editSubmitting = false;
        this.showEditModal = false;
        this.editing = null;
      },
      error: err => {
        this.editSubmitting = false;
        this.editError = err?.error ?? 'บันทึกไม่สำเร็จ';
        console.error('Update error:', err);
      }
    });
  }

  // ==== ลบที่อยู่ ====
  confirmDeleteAddress(item: UiShipping) {
    if (!confirm('คุณต้องการลบที่อยู่นี้ใช่ไหม?')) return;

    this.shipSvc.deleteShipping(item.id, this.userId).subscribe({
      next: () => {
        // เอาออกจาก list ทันที
        this.shippingList = this.shippingList.filter(x => x.id !== item.id);
      },
      error: err => {
        const msg = err?.error ?? 'ลบไม่สำเร็จ';
        alert(typeof msg === 'string' ? msg : 'ไม่สามารถลบที่อยู่นี้ได้');
      }
    });
  }
}
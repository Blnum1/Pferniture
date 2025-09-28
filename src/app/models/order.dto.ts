export type PayMethod = 'QR' | 'COD' | 'BANK';

export interface PaymentDto {
  payment_Method?: PayMethod;
  payment_Status?: string;
  payment_date?: string;   // ISO string
  payment_Amount?: number; // ฝั่งเซิร์ฟเวอร์จะ override จาก cart
}

export interface CreateOrderRequest {
  cartID: number;
  userID: number;
  shippingInfoID: number;
  payment: PaymentDto;
  status?: string;
  order_date?: string;
}

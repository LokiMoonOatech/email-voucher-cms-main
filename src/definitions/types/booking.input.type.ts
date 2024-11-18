export interface GdsGuestBookingInput {
  name: string;
  phone: string;
  nationality?: string;
  adult?: number;
  child_age?: number[];
}

export interface GdsRatePlanBookingInput {
  rateplan_id: number;
  price: number;
  guest: GdsGuestBookingInput;
}

export interface GdsBookerBookingInput {
  name: string;
  email?: string;
  phone: string;
  nationality?: string;
  timezone?: string;
}

export interface GdsAddBookingRequestInput {
  currency: string;
  channel_booking_number: string;
  checkin: string;
  checkout: string;
  rateplans: GdsRatePlanBookingInput[];
  booker: GdsBookerBookingInput;
}

// {
//   "canceled_by": "user",
//   "reason": "고객 개인 사정으로 60% 환불 처리",
//   "currency": "KRW",
//   "total_amount": 200000,
//   "refund_amount": 120000
// }

export interface GdsCancelBookingRequestInput {
  canceled_by: string;
  reason: string;
  currency: string;
  total_amount: number;
  refund_amount: number;
}

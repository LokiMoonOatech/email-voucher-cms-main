export interface GdsPropertyRoomTypeResponse {
  roomtypes: {
    id: string;
    property_id: string;
    name: string;
    status: string;
    updated_at: string;
  }[];
}

export interface GdsAddBookingResponse {
  succeed: boolean;
  booking_number: string;
  channel_booking_number: string;
  requested_at: string;
  created_at: string;
}

export interface GdsCancelBookingResponse {
  booking_number: string;
  channel_booking_number: string;
  currency: string;
  total_amount: number;
  refund_amount: number;
}

export interface GdsRatePlan {
  id: string;
  property_id: string;
  roomtype_id: string;
  name: string;
  status: string;
  type: string;
  updated_at: string;
}

export interface GdsPropertyRatePlanResponse {
  rateplans: GdsRatePlan[];
}

export interface GdsRoomType {
  id: string;
  property_id: string;
  name: string;
  status: string;
  updated_at: string;
}

export interface GdsRoomTypeWithRatePlans extends GdsRoomType {
  ratePlans: GdsRatePlan[];
}

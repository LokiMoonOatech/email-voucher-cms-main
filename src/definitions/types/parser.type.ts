import { MessageType } from 'src/database';

export interface ParsedStandardEmailBookingData {
  bookingCount: number;
  bookingNumber: string;
  propertyId: number;
  channelId: number;
  channelType: string;
  messageType: MessageType;
  propertyName: string;
  roomTypeName: string;
  ratePlanName: string;
  ratePlanId: number;
  guestName: string;
  guestPhone: string;
  checkInDate: Date;
  checkOutDate: Date;
  salePrice: number;
  netPrice: number;
  refundRate?: number;
  refundAmount?: number;
  cancelFeeRate?: number;
  cancelFeeAmount?: number | number[];
}

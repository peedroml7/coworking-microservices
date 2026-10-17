import { BookingStatusEnum } from '../enum/booking-status.enum';

export interface Booking {
  id: string;
  room_id: string;
  start: Date;
  end: Date;
  customer_email: string;
  status: BookingStatusEnum;
  total_price: number;
}

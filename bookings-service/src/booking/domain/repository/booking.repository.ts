import { CreateBookingInterface } from '../interface/create-booking.interface';
import { Booking } from '../model/booking';

export const BOOKING_REPOSITORY = Symbol('BOOKING_REPOSITORY');

export interface BookingRepository {
  findOne(id: string): Promise<Booking | null>;
  create(booking: CreateBookingInterface): Promise<Booking>;
  delete(id: string): Promise<boolean>;
  hasOverlap(room_id: string, start: Date, end: Date): Promise<boolean>;
}

import { Booking } from '../model/booking';

export type CreateBookingInterface = Omit<Booking, 'id'>;

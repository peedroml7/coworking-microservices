import { Inject } from '@nestjs/common';
import {
  BOOKING_REPOSITORY,
  type BookingRepository,
} from '../../domain/repository/booking.repository';
import { CreateBookingInterface } from '../../domain/interface/create-booking.interface';
import { Booking } from '../../domain/model/booking';

export class BookingCreator {
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repository: BookingRepository,
  ) {}

  public async create(newBooking: CreateBookingInterface): Promise<Booking> {
    return await this.repository.create(newBooking);
  }
}

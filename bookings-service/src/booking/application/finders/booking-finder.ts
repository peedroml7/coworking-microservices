import { Inject } from '@nestjs/common';
import {
  BOOKING_REPOSITORY,
  type BookingRepository,
} from '../../domain/repository/booking.repository';
import { Booking } from '../../domain/model/booking';
import { BookingNotFoundError } from '../../domain/error/booking-not-found.error';

export class BookingFinder {
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repository: BookingRepository,
  ) {}

  public async findOne(id: string): Promise<Booking> {
    const booking: Booking | null = await this.repository.findOne(id);

    if (!booking) throw new BookingNotFoundError(id);

    return booking;
  }
}

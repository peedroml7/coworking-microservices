import { Inject, NotFoundException } from '@nestjs/common';
import {
  BOOKING_REPOSITORY,
  type BookingRepository,
} from '../../domain/repository/booking.repository';
import { Booking } from '../../domain/model/booking';

export class BookingFinder {
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repository: BookingRepository,
  ) {}

  public async findOne(id: string): Promise<Booking | null> {
    const booking: Booking | null = await this.repository.findOne(id);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }
}

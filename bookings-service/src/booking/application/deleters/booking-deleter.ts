import { Inject } from '@nestjs/common';
import {
  BOOKING_REPOSITORY,
  type BookingRepository,
} from '../../domain/repository/booking.repository';
import { ResponseInterface } from '../../domain/interface/response.interface';
import { BookingNotFoundError } from '../../domain/error/booking-not-found.error';
import {
  NOTIFICATION_GATEWAY,
  type NotificationGateway,
} from '../../domain/gateway/notification.gateway';
import { BookingFinder } from '../finders/booking-finder';
import { Booking } from '../../domain/model/booking';

export class BookingDeleter {
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repository: BookingRepository,
    @Inject(NOTIFICATION_GATEWAY) private readonly gateway: NotificationGateway,
    private readonly finder: BookingFinder,
  ) {}

  public async delete(id: string): Promise<ResponseInterface> {
    const deletedBooking: Booking = await this.finder.findOne(id);

    const deleted: boolean = await this.repository.delete(id);

    if (!deleted) {
      throw new BookingNotFoundError('Booking not found');
    }

    this.gateway.sendNotification(
      deletedBooking.id,
      deletedBooking.room_id,
      'Booking cancelled successfully',
      deletedBooking.customer_email,
    );

    return {
      message: 'Booking deleted successfully',
    };
  }
}

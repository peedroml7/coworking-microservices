import { Inject } from '@nestjs/common';
import {
  BOOKING_REPOSITORY,
  type BookingRepository,
} from '../../domain/repository/booking.repository';
import { ResponseInterface } from '../../domain/interface/response.interface';
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

    await this.repository.delete(id);

    this.gateway.sendNotification(
      deletedBooking.id,
      deletedBooking.room_id,
      'Booking cancelled successfully',
      deletedBooking.customer_email,
      'booking_cancelled',
    );

    return {
      message: 'Booking deleted successfully',
    };
  }
}

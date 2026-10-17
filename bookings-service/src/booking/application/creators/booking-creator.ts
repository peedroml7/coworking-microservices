import { Inject } from '@nestjs/common';
import {
  BOOKING_REPOSITORY,
  type BookingRepository,
} from '../../domain/repository/booking.repository';
import { CreateBookingInterface } from '../../domain/interface/create-booking.interface';
import { Booking } from '../../domain/model/booking';
import { BookingConflictError } from '../../domain/error/booking-conflict.error';
import {
  ROOM_GATEWAY,
  type RoomGateway,
} from '../../domain/gateway/room.gateway';
import { Room } from '../../domain/model/room';
import { BookingStatusEnum } from '../../domain/enum/booking-status.enum';
import {
  NOTIFICATION_GATEWAY,
  type NotificationGateway,
} from '../../domain/gateway/notification.gateway';
import { InvalidBookingDatesError } from '../../domain/error/invalid-booking-dates.error';

export class BookingCreator {
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repository: BookingRepository,
    @Inject(ROOM_GATEWAY) private readonly roomGateway: RoomGateway,
    @Inject(NOTIFICATION_GATEWAY)
    private readonly notificationGateway: NotificationGateway,
  ) {}

  private MS_PER_HOUR = 1000 * 60 * 60;

  public async create(newBooking: CreateBookingInterface): Promise<Booking> {
    if (newBooking.end <= newBooking.start)
      throw new InvalidBookingDatesError();

    if (
      await this.repository.hasOverlap(
        newBooking.room_id,
        newBooking.start,
        newBooking.end,
      )
    )
      throw new BookingConflictError('Existing error on this period');

    const room: Room = await this.roomGateway.findRoomById(newBooking.room_id);

    const hours =
      (newBooking.end.getTime() - newBooking.start.getTime()) /
      this.MS_PER_HOUR;

    const totalPrice = hours * room.price_per_hour;

    const bookingCreated: Booking = await this.repository.create({
      ...newBooking,
      status: BookingStatusEnum.CONFIRMED,
      total_price: totalPrice,
    });

    this.notificationGateway.sendNotification(
      bookingCreated.id,
      bookingCreated.room_id,
      'Booking created successfully',
      bookingCreated.customer_email,
      'booking_created',
    );

    return bookingCreated;
  }
}

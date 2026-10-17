import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationFinder } from '../../application/finders/notification-finder';
import { NotificationCreator } from '../../application/creators/notification-creator';
import { type IncomingBookingEventInterface } from '../../domain/interface/incoming-booking-event.interface';

@Controller()
export class NotificationController {
  constructor(
    private readonly finder: NotificationFinder,
    private readonly creator: NotificationCreator,
  ) {}

  @EventPattern('booking_created')
  bookingCreated(@Payload() data: IncomingBookingEventInterface) {
    this.creator.create(data);
    console.log(`Booking with ID: ${data.booking_id} created successfully`);
  }

  @EventPattern('booking_cancelled')
  bookingDeleted(@Payload() data: IncomingBookingEventInterface) {
    this.creator.create(data);
    console.log(`Booking with ID: ${data.booking_id} cancelled successfully`);
  }

  @MessagePattern('find_notifications_by_email')
  getNotificationsByEmail(@Payload() data: string) {
    return this.finder.getNotificationsByEmail(data);
  }
}

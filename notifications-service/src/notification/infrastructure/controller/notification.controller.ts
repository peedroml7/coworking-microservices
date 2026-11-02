import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { NotificationFinder } from '../../application/finders/notification-finder';
import { NotificationCreator } from '../../application/creators/notification-creator';
import { type IncomingBookingEventInterface } from '../../domain/interface/incoming-booking-event.interface';

@Controller()
export class NotificationController {
  constructor(
    private readonly finder: NotificationFinder,
    private readonly creator: NotificationCreator,
  ) {}

  @EventPattern<string>('booking_created')
  async bookingCreated(
    @Payload() data: IncomingBookingEventInterface,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.creator.create(data);
      channel.ack(message);
      console.log(`Booking with ID: ${data.booking_id} created successfully`);
    } catch (error) {
      channel.nack(message, false, false);
      console.log(`Booking with ID: ${data.booking_id} created successfully`);
    }
  }

  @EventPattern<string>('booking_cancelled')
  async bookingDeleted(
    @Payload() data: IncomingBookingEventInterface,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.creator.create(data);
      channel.ack(message);
      console.log(`Booking with ID: ${data.booking_id} cancelled successfully`);
    } catch (error) {
      channel.nack(message, false, false);
    }
  }

  @MessagePattern('find_notifications_by_email')
  async getNotificationsByEmail(@Payload() data: string) {
    return await this.finder.getNotificationsByEmail(data);
  }
}

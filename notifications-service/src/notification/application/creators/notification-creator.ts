import { Inject, Injectable } from '@nestjs/common';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../../domain/repository/notification.repository';
import { IncomingBookingEventInterface } from '../../domain/interface/incoming-booking-event.interface';
import {
  NOTIFICATION_SENDER,
  type NotificationSenderInterface,
} from '../../domain/interface/notification-sender.interface';
import { Notification } from '../../domain/model/notification';

@Injectable()
export class NotificationCreator {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepository,
    @Inject(NOTIFICATION_SENDER)
    private readonly sender: NotificationSenderInterface,
  ) {}

  public async create(
    booking: IncomingBookingEventInterface,
  ): Promise<Notification> {
    const notification: Notification =
      await this.repository.saveNotification(booking);

    await this.sender.send({
      to: booking.customer_email,
      subject: booking.text,
    });

    return notification;
  }
}

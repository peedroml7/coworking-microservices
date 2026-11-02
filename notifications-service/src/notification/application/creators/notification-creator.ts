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
import { DuplicateEventError } from '../../domain/error/duplicate-event.error';

@Injectable()
export class NotificationCreator {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepository,
    @Inject(NOTIFICATION_SENDER)
    private readonly sender: NotificationSenderInterface,
  ) {}

  public async create(booking: IncomingBookingEventInterface): Promise<void> {
    try {
      await this.repository.saveNotification(booking);
    } catch (error: unknown) {
      if (!(error instanceof DuplicateEventError)) throw error;
    }

    await this.sender.send({
      event_id: booking.event_id,
      to: booking.customer_email,
      subject: booking.text,
    });
  }
}

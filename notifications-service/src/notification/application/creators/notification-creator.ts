import { Inject } from '@nestjs/common';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../../domain/repository/notification.repository';
import { IncomingBookingEventInterface } from '../../domain/interface/incoming-booking-event.interface';

export class NotificationCreator {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepository,
  ) {}

  public create(booking: IncomingBookingEventInterface): void {
    return this.repository.saveNotification(booking);
  }
}

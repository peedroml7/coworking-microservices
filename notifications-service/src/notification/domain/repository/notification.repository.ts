import { IncomingBookingEventInterface } from '../interface/incoming-booking-event.interface';
import { Notification } from '../model/notification';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export interface NotificationRepository {
  saveNotification(
    bookingData: IncomingBookingEventInterface,
  ): Promise<Notification>;
  getNotificationsByEmail(email: string): Promise<Notification[]>;
}

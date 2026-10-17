import { BookingEventType } from '../type/booking-event.type';

export const NOTIFICATION_GATEWAY = Symbol('NOTIFICATION_GATEWAY');

export interface NotificationGateway {
  sendNotification(
    booking_id: string,
    room_id: string,
    text: string,
    customer_email: string,
    event_type: BookingEventType,
  ): void;
}

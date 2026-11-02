import { RmqContext } from '@nestjs/microservices';
import { NotificationController } from './notification.controller';
import { NotificationFinder } from '../../application/finders/notification-finder';
import { NotificationCreator } from '../../application/creators/notification-creator';
import { IncomingBookingEventInterface } from '../../domain/interface/incoming-booking-event.interface';

const bookingEvent: IncomingBookingEventInterface = {
  booking_id: 'booking-1',
  room_id: 'room-1',
  text: 'Booking created successfully',
  customer_email: 'ana@example.com',
  event_id: 'event-1',
};

describe('NotificationController', () => {
  let controller: NotificationController;
  let finder: { getNotificationsByEmail: jest.Mock };
  let creator: { create: jest.Mock };
  let channel: { ack: jest.Mock; nack: jest.Mock };
  let message: object;
  let context: RmqContext;

  beforeEach(() => {
    finder = { getNotificationsByEmail: jest.fn() };
    creator = { create: jest.fn() };
    channel = { ack: jest.fn(), nack: jest.fn() };
    message = { content: Buffer.from('{}') };
    context = {
      getChannelRef: () => channel,
      getMessage: () => message,
    } as unknown as RmqContext;

    controller = new NotificationController(
      finder as unknown as NotificationFinder,
      creator as unknown as NotificationCreator,
    );
  });

  describe('booking_created', () => {
    it.todo('acks the message after creating the notification');

    it.todo('nacks without requeue when the creator fails');
  });

  describe('booking_cancelled', () => {
    it.todo('acks the message after creating the notification');

    it.todo('nacks without requeue when the creator fails');
  });

  describe('find_notifications_by_email', () => {
    it.todo('returns what the finder returns');
  });
});

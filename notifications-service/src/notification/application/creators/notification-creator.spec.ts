import { NotificationCreator } from './notification-creator';
import { NotificationRepository } from '../../domain/repository/notification.repository';
import { NotificationSenderInterface } from '../../domain/interface/notification-sender.interface';
import { IncomingBookingEventInterface } from '../../domain/interface/incoming-booking-event.interface';

const bookingEvent: IncomingBookingEventInterface = {
  booking_id: 'booking-1',
  room_id: 'room-1',
  text: 'Booking created successfully',
  customer_email: 'ana@example.com',
  event_id: 'event-1',
};

describe('NotificationCreator', () => {
  let creator: NotificationCreator;
  let repository: jest.Mocked<NotificationRepository>;
  let sender: jest.Mocked<NotificationSenderInterface>;

  beforeEach(() => {
    repository = {
      saveNotification: jest.fn(),
      getNotificationsByEmail: jest.fn(),
    };
    sender = { send: jest.fn() };

    creator = new NotificationCreator(repository, sender);
  });

  it.todo('saves the notification and queues the email');

  it.todo('sends event_id, customer_email and text to the sender');

  it.todo('still queues the email when the event is a duplicate');

  it.todo('rethrows any error that is not a duplicate and does not queue');

  it.todo('rethrows when the sender fails');
});

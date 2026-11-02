import { QueryFailedError, Repository } from 'typeorm';
import { NotificationsRepositoryImplement } from './notification.repository.implement';
import { NotificationEntity } from '../entity/notification.entity';
import { DuplicateEventError } from '../../domain/error/duplicate-event.error';
import { IncomingBookingEventInterface } from '../../domain/interface/incoming-booking-event.interface';

// Builds the error TypeORM throws when Postgres answers with that code
const postgresError = (code: string): QueryFailedError =>
  new QueryFailedError('INSERT INTO notifications', [], { code });

const bookingEvent: IncomingBookingEventInterface = {
  booking_id: 'booking-1',
  room_id: 'room-1',
  text: 'Booking created successfully',
  customer_email: 'ana@example.com',
  event_id: 'event-1',
};

describe('NotificationsRepositoryImplement', () => {
  let repository: NotificationsRepositoryImplement;
  let typeormRepo: { save: jest.Mock; find: jest.Mock };

  beforeEach(() => {
    typeormRepo = { save: jest.fn(), find: jest.fn() };

    repository = new NotificationsRepositoryImplement(
      typeormRepo as unknown as Repository<NotificationEntity>,
    );
  });

  it.todo('returns the saved notification');

  it.todo('throws DuplicateEventError on a unique violation (23505)');

  it.todo('rethrows other database errors as they are');

  it.todo('finds notifications by customer_email');
});

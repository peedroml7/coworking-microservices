import { Queue } from 'bullmq';
import { BullMQNotificationSender } from './bullmq-notification.sender';
import { NotificationMessageInterface } from '../../domain/interface/notification-message.interface';

const message: NotificationMessageInterface = {
  event_id: 'event-1',
  to: 'ana@example.com',
  subject: 'Booking created successfully',
};

describe('BullMQNotificationSender', () => {
  let sender: BullMQNotificationSender;
  let queue: { add: jest.Mock };

  beforeEach(() => {
    queue = { add: jest.fn() };

    sender = new BullMQNotificationSender(queue as unknown as Queue);
  });

  it.todo('adds a send_notification job with the message as data');

  it.todo('uses the event_id as jobId');
});

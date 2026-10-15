import { NotFoundException } from '@nestjs/common';
import { NotificationFinder } from './notification-finder';
import { NotificationRepository } from '../../domain/repository/notification.repository';
import { Notification } from '../../domain/model/notification';

class InMemoryNotificationRepository implements NotificationRepository {
  constructor(private readonly notifications: Notification[] = []) {}

  getNotificationsByEmail(email: string): Promise<Notification | null> {
    const found = this.notifications.find(
      (notification) => notification.customer_email === email,
    );
    return Promise.resolve(found ?? null);
  }
}

const confirmation: Notification = {
  id: 'notification-1',
  booking_id: 'booking-1',
  room_id: 'room-1',
  text: 'Your booking is confirmed',
  customer_email: 'ana@example.com',
};

describe('NotificationFinder', () => {
  it('returns the notification for an email', async () => {
    const finder = new NotificationFinder(
      new InMemoryNotificationRepository([confirmation]),
    );

    await expect(
      finder.getNotificationsByEmail('ana@example.com'),
    ).resolves.toEqual(confirmation);
  });

  it('throws when there is nothing for that email', async () => {
    const finder = new NotificationFinder(new InMemoryNotificationRepository());

    await expect(
      finder.getNotificationsByEmail('nobody@example.com'),
    ).rejects.toThrow(NotFoundException);
  });
});

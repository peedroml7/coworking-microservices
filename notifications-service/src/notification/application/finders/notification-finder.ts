import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../../domain/repository/notification.repository';
import { Notification } from '../../domain/model/notification';

@Injectable()
export class NotificationFinder {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepository,
  ) {}

  public async getNotificationsByEmail(email: string): Promise<Notification> {
    const notification: Notification | null =
      await this.repository.getNotificationsByEmail(email);

    if (!notification) {
      throw new NotFoundException('User with provided email not found');
    }

    return notification;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../../domain/repository/notification.repository';
import { Notification } from '../../domain/model/notification';
import { EmailNotFoundError } from '../../domain/error/email-not-found.error';

@Injectable()
export class NotificationFinder {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepository,
  ) {}

  public async getNotificationsByEmail(email: string): Promise<Notification[]> {
    const notification: Notification[] =
      await this.repository.getNotificationsByEmail(email);

    if (!notification) {
      throw new EmailNotFoundError();
    }

    return notification;
  }
}

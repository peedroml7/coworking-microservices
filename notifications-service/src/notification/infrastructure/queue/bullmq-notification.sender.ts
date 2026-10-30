import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { NOTIFICATION_QUEUE } from '../constants/notification-queue.constant';
import { Queue } from 'bullmq';
import { NotificationSenderInterface } from '../../domain/interface/notification-sender.interface';
import { NotificationMessageInterface } from '../../domain/interface/notification-message.interface';

@Injectable()
export class BullMQNotificationSender implements NotificationSenderInterface {
  constructor(@InjectQueue(NOTIFICATION_QUEUE) private readonly queue: Queue) {}

  public async send(data: NotificationMessageInterface): Promise<void> {
    await this.queue.add('send_notification', data);
  }
}

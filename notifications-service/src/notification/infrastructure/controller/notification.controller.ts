import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationFinder } from '../../application/finders/notification-finder';

@Controller()
export class NotificationController {
  constructor(private readonly finder: NotificationFinder) {}

  @MessagePattern('find_notifications_by_email')
  getNotificationsByEmail(@Payload() data: string) {
    return this.finder.getNotificationsByEmail(data);
  }
}

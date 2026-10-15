import { Controller, Get, Inject, Query } from '@nestjs/common';
import { NotificationInterface } from './interface/notification.interface';
import { NOTIFICATIONS_SERVICE } from '../shared/external-clients.module';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Controller('notifications')
export class NotificationController {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE) private readonly service: ClientProxy,
  ) {}

  @Get()
  public async getNotificationsByEmail(
    @Query('email') email: string,
  ): Promise<NotificationInterface[]> {
    return firstValueFrom(
      this.service
        .send<NotificationInterface[]>('find_notifications_by_email', email)
        .pipe(timeout(3000)),
    );
  }
}

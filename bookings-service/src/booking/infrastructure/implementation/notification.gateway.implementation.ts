import { Inject, Injectable } from '@nestjs/common';
import { NotificationGateway } from '../../domain/gateway/notification.gateway';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATION_CLIENT } from '../token/tokens';

@Injectable()
export class NotificationGatewayImplementation implements NotificationGateway {
  constructor(
    @Inject(NOTIFICATION_CLIENT) private readonly client: ClientProxy,
  ) {}

  sendNotification(
    booking_id: string,
    room_id: string,
    text: string,
    customer_email: string,
  ): void {
    this.client.emit('booking_created', {
      booking_id,
      room_id,
      text,
      customer_email,
    });
  }
}

import { NotificationMessageInterface } from './notification-message.interface';

export const NOTIFICATION_SENDER = Symbol('NOTIFICATION_SENDER');

export interface NotificationSenderInterface {
  send(data: NotificationMessageInterface): Promise<void>;
}

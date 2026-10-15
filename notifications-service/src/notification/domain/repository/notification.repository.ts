import { Notification } from '../model/notification';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export interface NotificationRepository {
  getNotificationsByEmail(email: string): Promise<Notification | null>;
}

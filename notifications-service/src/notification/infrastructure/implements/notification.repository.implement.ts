import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repository/notification.repository';
import { Notification } from '../../domain/model/notification';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../entity/notification.entity';
import { Repository } from 'typeorm';
import { IncomingBookingEventInterface } from '../../domain/interface/incoming-booking-event.interface';

@Injectable()
export class NotificationsRepositoryImplement implements NotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repo: Repository<NotificationEntity>,
  ) {}

  async saveNotification(
    bookingData: IncomingBookingEventInterface,
  ): Promise<Notification> {
    return this.repo.save(bookingData);
  }

  async getNotificationsByEmail(email: string): Promise<Notification[]> {
    return await this.repo.find({ where: { customer_email: email } });
  }
}

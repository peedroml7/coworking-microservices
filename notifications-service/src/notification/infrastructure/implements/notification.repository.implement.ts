import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repository/notification.repository';
import { Notification } from '../../domain/model/notification';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../entity/notification.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { IncomingBookingEventInterface } from '../../domain/interface/incoming-booking-event.interface';
import { DuplicateEventError } from '../../domain/error/duplicate-event.error';

const UNIQUE_VIOLATION = '23505';

@Injectable()
export class NotificationsRepositoryImplement implements NotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repo: Repository<NotificationEntity>,
  ) {}

  async saveNotification(
    bookingData: IncomingBookingEventInterface,
  ): Promise<Notification> {
    try {
      return await this.repo.save(bookingData);
    } catch (error: unknown) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === UNIQUE_VIOLATION
      ) {
        throw new DuplicateEventError(bookingData.event_id);
      }
      throw error;
    }
  }
  async getNotificationsByEmail(email: string): Promise<Notification[]> {
    return await this.repo.find({ where: { customer_email: email } });
  }
}

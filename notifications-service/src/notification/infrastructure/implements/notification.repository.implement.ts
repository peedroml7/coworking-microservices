import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repository/notification.repository';
import { Notification } from '../../domain/model/notification';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../entity/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsRepositoryImplement implements NotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repo: Repository<NotificationEntity>,
  ) {}

  async getNotificationsByEmail(email: string): Promise<Notification | null> {
    return await this.repo.findOne({ where: { customer_email: email } });
  }
}

import { Module } from '@nestjs/common';
import { NotificationController } from './controller/notification.controller';
import { NotificationFinder } from '../application/finders/notification-finder';
import { NOTIFICATION_REPOSITORY } from '../domain/repository/notification.repository';
import { NotificationsRepositoryImplement } from './implements/notification.repository.implement';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entity/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  controllers: [NotificationController],
  providers: [
    NotificationFinder,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationsRepositoryImplement,
    },
  ],
})
export class NotificationModule {}

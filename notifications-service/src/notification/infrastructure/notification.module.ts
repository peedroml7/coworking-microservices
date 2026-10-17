import { Module } from '@nestjs/common';
import { NotificationController } from './controller/notification.controller';
import { NotificationFinder } from '../application/finders/notification-finder';
import { NOTIFICATION_REPOSITORY } from '../domain/repository/notification.repository';
import { NotificationsRepositoryImplement } from './implements/notification.repository.implement';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entity/notification.entity';
import { NotificationCreator } from '../application/creators/notification-creator';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  controllers: [NotificationController],
  providers: [
    NotificationFinder,
    NotificationCreator,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationsRepositoryImplement,
    },
  ],
})
export class NotificationModule {}

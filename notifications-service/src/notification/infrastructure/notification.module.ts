import { Module } from '@nestjs/common';
import { NotificationController } from './controller/notification.controller';
import { NotificationFinder } from '../application/finders/notification-finder';
import { NOTIFICATION_REPOSITORY } from '../domain/repository/notification.repository';
import { NotificationsRepositoryImplement } from './implements/notification.repository.implement';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entity/notification.entity';
import { NotificationCreator } from '../application/creators/notification-creator';
import { BullModule } from '@nestjs/bullmq';
import { NOTIFICATION_QUEUE } from './constants/notification-queue.constant';
import { BullMQNotificationSender } from './queue/bullmq-notification.sender';
import { NOTIFICATION_SENDER } from '../domain/interface/notification-sender.interface';
import { HttpClientModule } from '@nestjs/http-client';
import { ConfigService } from '@nestjs/config';
import { HTTT_CLIENT_NAME } from './constants/http-client-name.constant';
import { BullMQNotificationProcessor } from './queue/bullmq-notification.processor';
import { ProviderTokenService } from './service/provider-token.service';

@Module({
  imports: [
    HttpClientModule.registerAsync({
      name: HTTT_CLIENT_NAME,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseUrl: config.getOrThrow<string>('PROVIDER_URL'),
        timeout: 5000,
      }),
    }),
    TypeOrmModule.forFeature([NotificationEntity]),
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE,
      defaultJobOptions: {
        attempts: 4,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationFinder,
    NotificationCreator,
    BullMQNotificationProcessor,
    ProviderTokenService,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationsRepositoryImplement,
    },
    { provide: NOTIFICATION_SENDER, useClass: BullMQNotificationSender },
  ],
})
export class NotificationModule {}

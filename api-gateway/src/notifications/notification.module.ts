import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { ExternalClientsModule } from '../shared/external-clients.module';

@Module({
  imports: [ExternalClientsModule],
  controllers: [NotificationController],
})
export class NotificationModule {}

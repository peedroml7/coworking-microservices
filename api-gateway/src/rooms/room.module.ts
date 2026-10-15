import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { ExternalClientsModule } from '../shared/external-clients.module';

@Module({
  imports: [ExternalClientsModule],
  controllers: [RoomController],
})
export class RoomModule {}

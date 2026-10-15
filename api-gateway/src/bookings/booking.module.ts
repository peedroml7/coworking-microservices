import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { ExternalClientsModule } from '../shared/external-clients.module';

@Module({
  imports: [ExternalClientsModule],
  controllers: [BookingController],
})
export class BookingModule {}

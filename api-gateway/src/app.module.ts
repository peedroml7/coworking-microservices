import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notifications/notification.module';
import { BookingModule } from './bookings/booking.module';
import { RoomModule } from './rooms/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NotificationModule,
    BookingModule,
    RoomModule,
  ],
})
export class AppModule {}

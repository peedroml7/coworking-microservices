import { Module } from '@nestjs/common';
import { BookingController } from './controller/booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './entity/booking.entity';
import { BookingFinder } from '../application/finders/booking-finder';
import { BookingCreator } from '../application/creators/booking-creator';
import { BookingDeleter } from '../application/deleters/booking-deleter';
import { BOOKING_REPOSITORY } from '../domain/repository/booking.repository';
import { BookingRespositoryImplementation } from './implementation/booking.respository.implementation';
import { RoomGatewayImplementation } from './implementation/room.gateway.implementation';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_CLIENT, ROOMS_CLIENT } from './token/tokens';
import { ROOM_GATEWAY } from '../domain/gateway/room.gateway';
import { NOTIFICATION_GATEWAY } from '../domain/gateway/notification.gateway';
import { NotificationGatewayImplementation } from './implementation/notification.gateway.implementation';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity]),
    ClientsModule.register([
      {
        name: ROOMS_CLIENT,
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3002 },
      },
      {
        name: NOTIFICATION_CLIENT,
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3003 },
      },
    ]),
  ],
  controllers: [BookingController],
  providers: [
    BookingFinder,
    BookingCreator,
    BookingDeleter,
    { provide: BOOKING_REPOSITORY, useClass: BookingRespositoryImplementation },
    { provide: ROOM_GATEWAY, useClass: RoomGatewayImplementation },
    {
      provide: NOTIFICATION_GATEWAY,
      useClass: NotificationGatewayImplementation,
    },
  ],
})
export class BookingModule {}

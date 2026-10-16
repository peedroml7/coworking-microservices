import { Module } from '@nestjs/common';
import { BookingController } from './controller/booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './entity/booking.entity';
import { BookingFinder } from '../application/finders/booking-finder';
import { BookingCreator } from '../application/creators/booking-creator';
import { BookingDeleter } from '../application/deleters/booking-deleter';
import { BOOKING_REPOSITORY } from '../domain/repository/booking.repository';
import { BookingRespositoryImplementation } from './implementation/booking.respository.implementation';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity])],
  controllers: [BookingController],
  providers: [
    BookingFinder,
    BookingCreator,
    BookingDeleter,
    { provide: BOOKING_REPOSITORY, useClass: BookingRespositoryImplementation },
  ],
})
export class BookingModule {}

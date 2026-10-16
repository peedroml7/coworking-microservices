import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookingFinder } from '../../application/finders/booking-finder';
import { BookingCreator } from '../../application/creators/booking-creator';
import { BookingDeleter } from '../../application/deleters/booking-deleter';
import { type CreateBookingInterface } from '../../domain/interface/create-booking.interface';

@Controller('bookings')
export class BookingController {
  constructor(
    private readonly finder: BookingFinder,
    private readonly creator: BookingCreator,
    private readonly deleter: BookingDeleter,
  ) {}

  @MessagePattern('find_booking_by_id')
  public async findOne(@Payload() data: string) {
    return await this.finder.findOne(data);
  }

  @MessagePattern('create_booking')
  public async create(@Payload() data: CreateBookingInterface) {
    return await this.creator.create(data);
  }

  @MessagePattern('delete_booking')
  public async delete(@Payload() data: string) {
    return await this.deleter.delete(data);
  }
}

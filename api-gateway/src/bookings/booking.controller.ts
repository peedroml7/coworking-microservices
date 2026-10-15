import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingInterface } from './interface/booking.interface';
import { BOOKINGS_SERVICE } from '../shared/external-clients.module';
import { ClientProxy } from '@nestjs/microservices';
import { ResponseInterface } from '../shared/interface/response.interface';
import { firstValueFrom, timeout } from 'rxjs';

@Controller('bookings')
export class BookingController {
  constructor(
    @Inject(BOOKINGS_SERVICE) private readonly service: ClientProxy,
  ) {}

  @Get(':id')
  public async getBooking(@Param('id') id: string): Promise<BookingInterface> {
    return firstValueFrom(
      this.service
        .send<BookingInterface>(id, 'find_booking_by_id')
        .pipe(timeout(3000)),
    );
  }

  @Post()
  public async createBooking(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingInterface> {
    return firstValueFrom(
      this.service
        .send<BookingInterface>(createBookingDto, 'create_booking')
        .pipe(timeout(3000)),
    );
  }

  @Delete(':id')
  public async deleteBooking(
    @Param('id') id: string,
  ): Promise<ResponseInterface> {
    return firstValueFrom(
      this.service
        .send<ResponseInterface>(id, 'delete_booking')
        .pipe(timeout(3000)),
    );
  }
}

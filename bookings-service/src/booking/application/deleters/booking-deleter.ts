import { Inject } from '@nestjs/common';
import {
  BOOKING_REPOSITORY,
  type BookingRepository,
} from '../../domain/repository/booking.repository';
import { ResponseInterface } from '../../domain/interface/response.interface';

export class BookingDeleter {
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repository: BookingRepository,
  ) {}

  public async delete(id: string): Promise<ResponseInterface> {
    const deleted: boolean = await this.repository.delete(id);

    return {
      message: deleted ? 'Booking deleted successfully' : 'Booking not found',
    };
  }
}

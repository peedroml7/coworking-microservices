import { DomainError } from './domain.error';

export class BookingNotFoundError extends DomainError {
  readonly statusCode: number = 404;

  constructor(id: string) {
    super(`Booking ${id} not found`);
  }
}

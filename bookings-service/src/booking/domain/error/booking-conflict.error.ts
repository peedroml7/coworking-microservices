import { DomainError } from './domain.error';

export class BookingConflictError extends DomainError {
  readonly statusCode: number = 409;

  constructor(message: string) {
    super(message);
  }
}

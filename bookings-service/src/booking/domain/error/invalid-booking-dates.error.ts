import { DomainError } from './domain.error';

export class InvalidBookingDatesError extends DomainError {
  readonly statusCode: number = 400;

  constructor() {
    super('End date cannot be <= than start date');
  }
}

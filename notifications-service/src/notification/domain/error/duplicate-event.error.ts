import { DomainError } from './domain-error';

export class DuplicateEventError extends DomainError {
  readonly statusCode: number = 409;

  constructor(event_id: string) {
    super(`Event with ID: ${event_id} already processed`);
  }
}

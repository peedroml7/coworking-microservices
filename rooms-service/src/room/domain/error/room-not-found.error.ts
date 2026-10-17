import { DomainError } from './domain.error';

export class RoomNotFoundError extends DomainError {
  readonly statusCode: number = 404;

  constructor(id: string) {
    super(`Room ${id} not found`);
  }
}
